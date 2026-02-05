"""
Agent Engine App - Deploy your agent to Google Cloud

This file contains the logic to deploy your agent to Vertex AI Agent Engine.
"""

import argparse
import base64
import copy
import datetime
import json
import os
import subprocess
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from typing import Any

import vertexai
from competitor_analysis_agent.agent import root_agent
from competitor_analysis_agent.config import config
from competitor_analysis_agent.utils.tracing import CloudTraceLoggingSpanExporter
from competitor_analysis_agent.utils.typing import Feedback
from dotenv import load_dotenv
from google.adk.sessions import DatabaseSessionService
from google.cloud import logging as google_cloud_logging
from google.cloud import storage
from google.cloud.exceptions import Conflict, NotFound
from google.cloud.iam_admin_v1 import (
    CreateServiceAccountKeyRequest,
    CreateServiceAccountRequest,
    IAMClient,
    ServiceAccount,
    ServiceAccountPrivateKeyType,
)
from google.cloud.resourcemanager_v3 import ProjectsClient
from google.iam.v1 import policy_pb2
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider, export
from pydantic import BaseModel
from vertexai import agent_engines
from vertexai.preview.reasoning_engines import AdkApp

# Required APIs for Agent Engine deployment
REQUIRED_APIS = [
    "iam.googleapis.com",  # Identity and Access Management API (service accounts)
    "cloudresourcemanager.googleapis.com",  # Resource Manager API (IAM policies)
    "aiplatform.googleapis.com",  # Vertex AI API (Agent Engine deployment)
    "storage.googleapis.com",  # Cloud Storage API (staging bucket)
]


def run_command_parallel(
    commands: list[tuple[str, str]], max_workers: int = 5
) -> list[tuple[str, bool, str]]:
    """
    Execute multiple shell commands in parallel with proper error handling.

    Args:
        commands: List of tuples (description, command)
        max_workers: Maximum number of concurrent workers

    Returns:
        List of tuples (description, success, error_message)
    """
    results = []

    def execute_command(desc_cmd: tuple[str, str]) -> tuple[str, bool, str]:
        description, cmd = desc_cmd
        try:
            result = subprocess.run(
                cmd,
                shell=True,
                capture_output=True,
                text=True,
                timeout=300,
                check=True,
            )
            return (description, True, result.stdout.strip())
        except subprocess.CalledProcessError as e:
            return (description, False, e.stderr.strip() if e.stderr else str(e))
        except Exception as e:
            return (description, False, str(e))

    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        # Submit all commands
        future_to_desc = {
            executor.submit(execute_command, desc_cmd): desc_cmd[0]
            for desc_cmd in commands
        }

        # Collect results as they complete
        for future in as_completed(future_to_desc):
            try:
                result = future.result()
                results.append(result)
            except Exception as e:
                desc = future_to_desc[future]
                results.append((desc, False, str(e)))

    return results


def enable_required_apis(project_id: str) -> None:
    """Enable required Google Cloud APIs for Agent Engine deployment"""
    print("🔌 Enabling required Google Cloud APIs...")
    print("   💡 This ensures all necessary APIs are available for deployment")

    # Prepare commands for parallel execution
    commands = []
    for api in REQUIRED_APIS:
        cmd = f"gcloud services enable {api} --project={project_id} --quiet"
        commands.append((api, cmd))

    # Execute APIs in parallel (saves time vs sequential)
    print("   💨 Enabling APIs in parallel...")
    results = run_command_parallel(commands, max_workers=6)

    # Process results
    success_count = 0
    failed_apis = []
    for api, success, error in results:
        if success:
            print(f"  ✓ {api}")
            success_count += 1
        else:
            # Check if already enabled (common case)
            if "already enabled" in error.lower() or "enabled" in error.lower():
                print(f"  ✓ {api} (already enabled)")
                success_count += 1
            else:
                print(f"  ❌ {api}: {error}")
                failed_apis.append(api)

    if failed_apis:
        print(f"❌ Failed to enable APIs: {', '.join(failed_apis)}")
        print("This will likely cause deployment failures. Please check:")
        print("  • Project billing is enabled")
        print("  • You have proper permissions")
        print("  • Project exists and is accessible")
        raise RuntimeError(f"Failed to enable required APIs: {', '.join(failed_apis)}")

    print(
        f"✅ All required APIs enabled successfully ({success_count}/{len(REQUIRED_APIS)})"
    )

    # Wait a moment for APIs to propagate
    print("   ⏳ Waiting for APIs to propagate...")
    time.sleep(5)


class DeploymentConfig(BaseModel):
    """Configuration for deployment."""

    agent_name: str
    project: str
    location: str
    staging_bucket: str  # Required - must be provided
    requirements_file: str = "requirements.txt"
    extra_packages: list[str] = []
    environment: str  # dev or prod


def get_deployment_config(environment: str = "dev") -> DeploymentConfig:
    """Gets deployment configuration from environment variables."""
    # Load the appropriate environment file
    env_file = f".env.{environment}" if environment == "prod" else ".env.local"

    # Check if the environment file exists
    if not os.path.exists(env_file):
        raise FileNotFoundError(
            f"Environment file '{env_file}' not found. "
            f"Please create this file with the required environment variables."
        )

    load_dotenv(
        env_file, override=True
    )  # override=True ensures env-specific values take precedence
    print(f"📋 Loading environment from: {env_file}")

    # Use global config instance
    # Get bucket name from environment variables
    staging_bucket = os.getenv("GOOGLE_CLOUD_STAGING_BUCKET")

    # Validate that required staging bucket is provided
    if not staging_bucket:
        raise ValueError(
            "GOOGLE_CLOUD_STAGING_BUCKET environment variable is required. "
            "Please provide a staging bucket name for Vertex AI deployment."
        )

    # Update agent name with environment suffix
    agent_name = f"{config.agent_name}-{environment}"

    return DeploymentConfig(
        agent_name=agent_name,
        project=config.google_cloud_project,
        location=config.google_cloud_location,
        staging_bucket=staging_bucket,
        environment=environment,
    )


def create_session_service() -> DatabaseSessionService:
    """Create a database session service using the DATABASE_URL from .env file."""
    database_url = config.get_database_url()
    return DatabaseSessionService(db_url=database_url)


def ensure_staging_bucket(project_id: str, agent_name: str) -> str:
    """
    Ensure a staging bucket exists using hierarchical naming strategy.

    Tries bucket names in this order:
    1. {project-id}-staging
    2. {project-id}-{agent-name}-staging
    3. {project-id}-{agent-name}-staging-2
    4. {project-id}-{agent-name}-staging-3
    ...

    Returns the bucket name that was created or found.
    """
    storage_client = storage.Client(project=project_id)

    # Generate candidate bucket names in hierarchical order
    candidates = [
        f"{project_id}-staging",
        f"{project_id}-{agent_name}-staging",
    ]

    # Add numbered variations
    for i in range(2, 50):  # Try up to 50 variations
        candidates.append(f"{project_id}-{agent_name}-staging-{i}")

    for bucket_name in candidates:
        print(f"🔍 Trying bucket name: {bucket_name}")

        try:
            # Check if bucket already exists
            bucket = storage_client.bucket(bucket_name)

            # Try to get bucket metadata to see if we can access it
            try:
                bucket.reload()
                print(f"✅ Found existing bucket: {bucket_name}")
                return bucket_name
            except NotFound:
                # Bucket doesn't exist, try to create it
                print(f"📦 Creating bucket: {bucket_name}")
                bucket.storage_class = "STANDARD"
                new_bucket = storage_client.create_bucket(bucket, location="us")
                print(f"✅ Created bucket: {new_bucket.name} in {new_bucket.location}")
                return bucket_name

        except Conflict:
            # Bucket exists but we don't own it, try next name
            print(f"❌ Bucket {bucket_name} already exists (owned by someone else)")
            continue
        except Exception as e:
            print(f"❌ Error with bucket {bucket_name}: {e}")
            continue

    # If we get here, all attempts failed
    raise RuntimeError(
        f"Failed to create staging bucket after trying {len(candidates)} names. "
        f"This should never happen - please check your Google Cloud permissions."
    )


def generate_service_account_name(agent_name: str) -> str:
    """
    Generate a meaningful service account name from agent name.

    Rules:
    - 6-30 characters, alphanumeric + hyphens only
    - Format: {sanitized-agent-name}-sa
    - Removes common suffixes to keep meaningful parts
    - Truncates intelligently if too long
    """
    # Step 1: Basic sanitization
    name = agent_name.lower()
    name = name.replace("_", "-").replace(" ", "-")
    # Keep only alphanumeric and hyphens
    name = "".join(c for c in name if c.isalnum() or c == "-")
    # Remove consecutive hyphens and strip
    while "--" in name:
        name = name.replace("--", "-")
    name = name.strip("-")

    # Step 2: Remove common suffixes to keep meaningful parts
    common_suffixes = ["agent", "analysis", "service", "processor", "engine", "app"]
    for suffix in common_suffixes:
        if name.endswith(f"-{suffix}"):
            name = name[:-len(suffix)-1]
            break

    # Step 3: Ensure it fits (30 total - 3 for "-sa" - 2 for potential "-2" = 25 max)
    if len(name) > 25:
        name = name[:25]

    # Step 4: Add service account suffix
    return f"{name}-sa"


def ensure_service_account(
    project_id: str, agent_name: str, environment: str = "dev"
) -> str:
    """
    Ensure a service account exists with meaningful naming.

    Generates service account name from agent_name, then tries:
    1. {agent-name}-sa
    2. {agent-name}-sa-2
    3. {agent-name}-sa-3
    etc.

    Returns the service account email that was created or found.
    Creates and outputs base64-encoded key when account is created or roles are missing.
    """
    iam_client = IAMClient()

    # Generate base service account name
    base_sa_name = generate_service_account_name(agent_name)

    # Generate candidate names for conflict resolution
    candidates = [base_sa_name]
    for i in range(2, 50):  # Try numbered variations if conflicts exist
        candidate = f"{base_sa_name[:-3]}-sa-{i}"  # Remove "-sa", add "-sa-{i}"
        if len(candidate) <= 30:
            candidates.append(candidate)

    for sa_name in candidates:
        print(f"🔍 Trying service account name: {sa_name} ({len(sa_name)} chars)")
        sa_email = f"{sa_name}@{project_id}.iam.gserviceaccount.com"

        try:
            # Check if service account already exists
            try:
                service_account = iam_client.get_service_account(
                    name=f"projects/{project_id}/serviceAccounts/{sa_email}"
                )
                print(f"✅ Found existing service account: {sa_email}")

                # Check if it has required roles and add missing ones
                _ensure_service_account_roles(project_id, sa_email)

                # Always create key for production deployment (needed for web app)
                print("🔑 Creating service account key for web app access...")
                # Small delay to ensure service account is ready
                print("⏳ Waiting 4 seconds for service account to be ready...")
                time.sleep(4)
                _create_and_output_service_account_key(
                    iam_client, sa_email, project_id, environment
                )

                return sa_email

            except NotFound:
                # Service account doesn't exist, try to create it
                print(f"👤 Creating service account: {sa_name}")

                request = CreateServiceAccountRequest(
                    name=f"projects/{project_id}",
                    account_id=sa_name,
                    service_account=ServiceAccount(
                        display_name=f"ADK Agent Service Account ({agent_name})",
                        description=f"Service account for ADK agent deployment: {agent_name}",
                    ),
                )

                service_account = iam_client.create_service_account(request=request)
                print(f"✅ Created service account: {service_account.email}")

                # Wait for service account to propagate before assigning roles
                print("⏳ Waiting 5 seconds for service account to propagate before role assignment...")
                time.sleep(5)

                # Assign required roles (will always return True for new account)
                _ensure_service_account_roles(project_id, service_account.email)

                # Create key since this is a new service account
                print("🔑 New service account created - creating access key...")
                # Additional delay to ensure role propagation for key creation
                print("⏳ Waiting 4 more seconds for role assignment to propagate...")
                time.sleep(4)
                _create_and_output_service_account_key(
                    iam_client, service_account.email, project_id, environment
                )

                return service_account.email

        except Conflict:
            # Service account exists but we don't own it, try next name
            print(
                f"❌ Service account {sa_name} already exists (owned by someone else)"
            )
            continue
        except Exception as e:
            print(f"❌ Error with service account {sa_name}: {e}")
            continue

    # If we get here, all attempts failed
    raise RuntimeError(
        f"Failed to create service account after trying {len(candidates)} names. "
        f"Please check your Google Cloud IAM permissions."
    )


def _ensure_service_account_roles(project_id: str, sa_email: str) -> bool:
    """
    Ensure service account has required roles for Vertex AI Agent Engine.

    Returns True if any roles were added, False if account already had all roles.
    """
    required_roles = [
        "roles/aiplatform.user",  # Vertex AI User
        "roles/iam.serviceAccountTokenCreator",  # Service Account Token Creator
    ]

    try:
        # Use Resource Manager client for IAM policy operations
        resource_client = ProjectsClient()

        # Get current IAM policy
        policy = resource_client.get_iam_policy(
            request={"resource": f"projects/{project_id}"}
        )

        roles_added = False
        member = f"serviceAccount:{sa_email}"

        for role in required_roles:
            # Check if binding exists for this role
            binding_exists = False

            for binding in policy.bindings:
                if binding.role == role and member in binding.members:
                    binding_exists = True
                    break

            if not binding_exists:
                # Add the role binding
                print(f"🔐 Adding role {role} to {sa_email}")

                # Find existing binding for this role or create new one
                target_binding = None
                for binding in policy.bindings:
                    if binding.role == role:
                        target_binding = binding
                        break

                if target_binding:
                    # Add member to existing binding
                    target_binding.members.append(member)
                else:
                    # Create new binding using proper protobuf object
                    new_binding = policy_pb2.Binding(
                        role=role,
                        members=[member]
                    )
                    policy.bindings.append(new_binding)

                roles_added = True
                print(f"✅ Role {role} added successfully")
            else:
                print(f"✅ Service account already has role: {role}")

        # Set the updated policy if any roles were added
        if roles_added:
            resource_client.set_iam_policy(
                request={"resource": f"projects/{project_id}", "policy": policy}
            )
            print("🔐 IAM policy updated successfully")

        return roles_added

    except Exception as e:
        print(f"⚠️  Warning: Could not manage IAM roles: {e}")
        return False


def _create_and_output_service_account_key(
    iam_client: IAMClient, sa_email: str, project_id: str, environment: str = "dev"
) -> str | None:
    """
    Create a service account key, base64 encode it, and output instructions for web project.
    Also automatically updates the web app's environment file.

    Uses retry logic to handle Google Cloud eventual consistency issues.

    Returns:
        The base64-encoded key if successful, None otherwise.
    """
    # Add retry logic to handle eventual consistency
    max_retries = 3
    for attempt in range(max_retries):
        try:
            # Wait a bit for service account to propagate across systems
            if attempt > 0:
                wait_time = 2 ** attempt  # Exponential backoff: 2, 4 seconds
                print(f"⏳ Waiting {wait_time} seconds for service account to propagate (attempt {attempt + 1}/{max_retries})...")
                time.sleep(wait_time)

            # Create service account key
            request = CreateServiceAccountKeyRequest(
                name=f"projects/{project_id}/serviceAccounts/{sa_email}",
                private_key_type=ServiceAccountPrivateKeyType.TYPE_GOOGLE_CREDENTIALS_FILE,
            )

            key = iam_client.create_service_account_key(request=request)
            break  # Success - exit retry loop

        except Exception as e:
            if "does not exist" in str(e) and attempt < max_retries - 1:
                print(f"⚠️  Service account not yet available: {e}")
                continue  # Retry
            else:
                # Final attempt failed or different error
                print(f"⚠️  Warning: Could not create service account key: {e}")
                return None
    else:
        # All retries exhausted
        print(f"❌ Failed to create service account key after {max_retries} attempts")
        return None

    try:
        # Base64 encode the key
        key_json = key.private_key_data
        key_base64 = base64.b64encode(key_json).decode("utf-8")

        # Output instructions
        print("\n" + "=" * 80)
        print("✅ Service account configured successfully!")
        print(
            "\n📋 IMPORTANT: Service account key will be added to your web app automatically"
        )
        env_file_name = ".env.prod" if environment == "prod" else ".env.local"
        print(f"\n📁 Target: apps/web/{env_file_name}")
        print("📝 Variable: GOOGLE_SERVICE_ACCOUNT_KEY_BASE64")

        # Also show manual instructions for reference
        print("\n💡 Manual backup (if needed):")
        print(f"GOOGLE_SERVICE_ACCOUNT_KEY_BASE64={key_base64}")
        print("=" * 80 + "\n")

        # Automatically update web app's environment file
        update_web_app_env_file(key_base64, environment)

        return key_base64

    except Exception as e:
        print(f"⚠️  Warning: Could not create service account key: {e}")
        return None


def update_env_prod_file(bucket_name: str) -> None:
    """
    Safely update the GOOGLE_CLOUD_STAGING_BUCKET value in .env.prod file.

    Creates or updates the .env.prod file with the staging bucket name.
    """
    env_file = ".env.prod"
    env_var_name = "GOOGLE_CLOUD_STAGING_BUCKET"
    new_line = f"{env_var_name}={bucket_name}"

    # Read existing file content
    lines: list[str] = []
    if os.path.exists(env_file):
        with open(env_file) as f:
            lines = f.readlines()

    # Find and update the line with GOOGLE_CLOUD_STAGING_BUCKET
    updated = False
    for i, line in enumerate(lines):
        if line.strip().startswith(f"{env_var_name}="):
            lines[i] = f"{new_line}\n"
            updated = True
            print(f"🔄 Updated existing {env_var_name} in {env_file}")
            break

    # If not found, add it to the end
    if not updated:
        lines.append(f"{new_line}\n")
        print(f"✅ Added {env_var_name} to {env_file}")

    # Write back to file
    with open(env_file, "w") as f:
        f.writelines(lines)

    print(f"✅ Successfully updated {env_file} with bucket: {bucket_name}")


def update_web_app_env_file(key_base64: str, environment: str = "dev") -> None:
    """
    Safely update the GOOGLE_SERVICE_ACCOUNT_KEY_BASE64 value in web app's environment file.

    Creates or updates the appropriate environment file with the service account key.
    - Production: apps/web/.env.prod
    - Development: apps/web/.env.local
    """
    # Choose the correct env file based on environment
    if environment == "prod":
        web_env_file = Path("../web/.env.prod")  # Go up to apps/, then into web/
    else:
        web_env_file = Path("../web/.env.local")  # Go up to apps/, then into web/

    env_var_name = "GOOGLE_SERVICE_ACCOUNT_KEY_BASE64"
    new_line = f"{env_var_name}={key_base64}"

    # Read existing file content
    lines: list[str] = []
    if web_env_file.exists():
        with open(web_env_file) as f:
            lines = f.readlines()

    # Find and update the line with GOOGLE_SERVICE_ACCOUNT_KEY_BASE64
    updated = False
    for i, line in enumerate(lines):
        if line.strip().startswith(f"{env_var_name}="):
            lines[i] = f"{new_line}\n"
            updated = True
            print(f"🔄 Updated existing {env_var_name} in {web_env_file}")
            break

    # If not found, add it to the end
    if not updated:
        lines.append(f"{new_line}\n")
        print(f"✅ Added {env_var_name} to {web_env_file}")

    # Ensure parent directory exists
    web_env_file.parent.mkdir(parents=True, exist_ok=True)

    # Write back to file
    with open(web_env_file, "w") as f:
        f.writelines(lines)

    print(f"✅ Successfully updated {web_env_file} with service account key")


class AgentEngineApp(AdkApp):
    """
    ADK Application wrapper for Agent Engine deployment.

    This class extends the base ADK app with logging, tracing, and feedback capabilities.
    """

    def set_up(self) -> None:
        """Set up logging and tracing for the agent engine app."""
        super().set_up()
        # Use global config instance
        logging_client = google_cloud_logging.Client()
        self.logger = logging_client.logger(__name__)
        provider = TracerProvider()
        processor = export.BatchSpanProcessor(
            CloudTraceLoggingSpanExporter(
                project_id=config.google_cloud_project,
                service_name=f"{config.agent_name}-service",
            )
        )
        provider.add_span_processor(processor)
        trace.set_tracer_provider(provider)
        self.enable_tracing = True

    def register_feedback(self, feedback: dict[str, Any]) -> None:
        """Collect and log feedback from users."""
        feedback_obj = Feedback.model_validate(feedback)
        self.logger.log_struct(feedback_obj.model_dump(), severity="INFO")

    def register_operations(self) -> dict[str, list[str]]:
        """Register available operations for the agent."""
        operations = super().register_operations()
        operations[""] = operations[""] + ["register_feedback"]
        return operations

    def clone(self) -> "AgentEngineApp":
        """Create a copy of this application."""
        template_attributes = self._tmpl_attrs

        return self.__class__(
            agent=copy.deepcopy(template_attributes["agent"]),
            enable_tracing=bool(template_attributes.get("enable_tracing", False)),
            session_service_builder=template_attributes.get("session_service_builder"),
            env_vars=template_attributes.get("env_vars"),
        )


def deploy_agent_engine_app(environment: str = "dev") -> agent_engines.AgentEngine:
    """
    Deploy the agent to Vertex AI Agent Engine.

    This function:
    1. Gets deployment configuration from environment variables
    2. For production: Auto-creates GCS staging bucket and updates .env.prod
    3. For development: Uses bucket from .env.local (must already exist)
    4. Deploys the agent to Agent Engine
    5. Saves deployment metadata to logs/deployment_metadata.json

    Environment-specific behavior:
    - Production (--env prod): Auto-creates staging bucket using hierarchical naming
      and updates .env.prod with the bucket name
    - Development (--env dev): Uses GOOGLE_CLOUD_STAGING_BUCKET from .env.local

    Returns:
        The deployed agent engine instance

    Raises:
        ValueError: If required staging bucket is not provided (dev environment)
        RuntimeError: If bucket creation fails (prod environment)
    """
    print("🚀 Starting Agent Engine deployment...")

    # Step 1: Get deployment configuration
    deployment_config = get_deployment_config(environment)
    print(f"📋 Deploying agent: {deployment_config.agent_name}")
    print(f"📋 Project: {deployment_config.project}")
    print(f"📋 Location: {deployment_config.location}")

    # Step 1.1: Enable required APIs before any operations
    enable_required_apis(deployment_config.project)

    # Step 2: Pass required environment variables from .env.local to deployed agent
    env_vars = {}

    # Define the environment variables the agent actually needs
    # Note: GOOGLE_CLOUD_PROJECT and GOOGLE_CLOUD_LOCATION are automatically
    # provided by Vertex AI Agent Engine and should NOT be passed explicitly
    required_env_vars = [
        "DATABASE_URL",  # For session management
        "NUM_WORKERS",  # Worker configuration
    ]

    # Optional environment variables that should be passed if present
    optional_env_vars: list[str] = [
        # Add any agent-specific config variables here
        # Note: Google Cloud vars are automatically provided by the runtime
    ]

    # Add required environment variables
    for var in required_env_vars:
        value = os.getenv(var)
        if value:
            env_vars[var] = value
        elif var == "NUM_WORKERS":
            env_vars[var] = "1"  # Default value

    # Add optional environment variables if they exist
    for var in optional_env_vars:
        value = os.getenv(var)
        if value:
            env_vars[var] = value

    print(f"📋 Environment variables to deploy: {list(env_vars.keys())}")

    # Step 3: Handle staging bucket - auto-create for production environment
    if environment == "prod":
        print("🏭 Production environment detected - ensuring staging bucket exists...")

        # Auto-create staging bucket using hierarchical naming
        # Use global config instance
        staging_bucket_name = ensure_staging_bucket(
            project_id=deployment_config.project,
            agent_name=config.agent_name,
        )

        # Update .env.prod file with the bucket name
        update_env_prod_file(staging_bucket_name)

        print(f"✅ Production staging bucket ready: {staging_bucket_name}")

        # Step 3.1: Ensure service account exists for production
        print("👤 Production environment - ensuring service account exists...")

        service_account_email = ensure_service_account(
            project_id=deployment_config.project,
            agent_name=config.agent_name,
            environment=environment,
        )

        print(f"✅ Production service account ready: {service_account_email}")

    else:
        # Development environment - use provided bucket name from .env.local
        staging_bucket_name = deployment_config.staging_bucket
        print(f"📦 Using staging bucket from environment: {staging_bucket_name}")
        service_account_email = None  # No service account creation in dev

    # Step 4: Initialize Vertex AI for deployment
    vertexai.init(
        project=deployment_config.project,
        location=deployment_config.location,
        staging_bucket=f"gs://{staging_bucket_name}",
    )

    # Step 5: Read requirements file
    with open(deployment_config.requirements_file) as f:
        requirements = f.read().strip().split("\n")
        print(f"📦 Requirements: {requirements}")

    # Step 6: Create the agent engine app
    agent_engine = AgentEngineApp(
        agent=root_agent,
        session_service_builder=create_session_service,
    )

    # Step 7: Configure the agent for deployment
    extra_packages = ["./competitor_analysis_agent"] + deployment_config.extra_packages
    print(f"📦 Extra packages: {extra_packages}")

    # Config for both create and update methods
    agent_config = {
        "agent_engine": agent_engine,
        "display_name": deployment_config.agent_name,
        "description": "A comprehensive agent for competitor analysis.",
        "extra_packages": extra_packages,
        "env_vars": env_vars,
        "requirements": requirements,
    }

    # Step 8: Deploy or update the agent
    existing_agents = list(
        agent_engines.list(filter=f'display_name="{deployment_config.agent_name}"')
    )

    if existing_agents:
        print(f"🔄 Updating existing agent: {deployment_config.agent_name}")
        print(f"🔧 Update config keys: {list(agent_config.keys())}")
        try:
            remote_agent = existing_agents[0].update(**agent_config)
        except Exception as e:
            print(f"❌ Update failed: {e}")
            print(f"📋 Config used: {agent_config}")
            raise
    else:
        print(f"🆕 Creating new agent: {deployment_config.agent_name}")
        print(f"🔧 Create config keys: {list(agent_config.keys())}")
        print(f"🔧 Agent engine type: {type(agent_engine)}")
        try:
            remote_agent = agent_engines.create(**agent_config)
        except Exception as e:
            print(f"❌ Creation failed: {e}")
            print(f"📋 Config used: {agent_config}")
            raise

    # Step 9: Save deployment metadata
    metadata = {
        "remote_agent_engine_id": remote_agent.resource_name,
        "deployment_timestamp": datetime.datetime.now(
            datetime.timezone.utc
        ).isoformat(),
        "agent_name": deployment_config.agent_name,
        "project": deployment_config.project,
        "location": deployment_config.location,
        "environment": environment,
    }

    # Add service account email if created (production only)
    if service_account_email:
        metadata["service_account_email"] = service_account_email

    logs_dir = Path("logs")  # logs/ directory in current agent project
    logs_dir.mkdir(exist_ok=True)
    metadata_file = logs_dir / "deployment_metadata.json"

    with open(metadata_file, "w") as f:
        json.dump(metadata, f, indent=2)

    print("✅ Agent deployed successfully!")
    print(f"📄 Deployment metadata saved to: {metadata_file}")
    print(f"🆔 Agent Engine ID: {remote_agent.resource_name}")

    return remote_agent


if __name__ == "__main__":
    # Parse command line arguments
    parser = argparse.ArgumentParser(
        description="Deploy agent to Vertex AI Agent Engine"
    )
    parser.add_argument(
        "--env",
        choices=["dev", "prod"],
        default="dev",
        help="Environment to deploy to (dev or prod). Default: dev",
    )
    args = parser.parse_args()

    print(
        f"""
    ╔═══════════════════════════════════════════════════════════╗
    ║                                                           ║
    ║   🤖 DEPLOYING AGENT TO VERTEX AI AGENT ENGINE ({args.env.upper()}) 🤖         ║
    ║                                                           ║
    ╚═══════════════════════════════════════════════════════════╝
    """
    )

    deploy_agent_engine_app(args.env)
