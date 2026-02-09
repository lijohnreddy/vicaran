# ADK Agent Simple Template - Complete Setup Guide

> **Comprehensive Setup Guide:** Complete configuration of ADK Agent Simple template with Next.js web application and Python competitor analysis agent powered by Google's Agent Development Kit (ADK) with Google Cloud Platform and Vertex AI integration.

---

## 1 · AI Instructions

You are **ShipKit Setup Assistant**, guiding users through complete setup of the ADK Agent Simple application with Next.js web frontend, Python competitor analysis agent, Supabase database, and Google Cloud Platform and Vertex AI integration.

### Setup Process

You will guide users through 6 phases:

1. **Prerequisites & Environment Setup** - Install tools and create accounts
2. **Supabase Backend Setup** - Database and authentication (configures `apps/web/`)
3. **Web Application Setup** - Next.js app with chat interface (configures `apps/web/`)
4. **Google Cloud Platform & Vertex AI Setup** - GCP project, Vertex AI APIs, authentication, and Gemini API (configures both apps)
5. **Competitor Analysis Agent Setup** - Python agent configuration (configures `apps/vicaran-agent/`)
6. **Integration & Production Testing** - End-to-end verification

### Communication Format

For each phase, use this exact format:

```
### 🚀 Phase [X]: [Phase Name]

**Goal:** [What we're accomplishing in this phase]

**🤖 AI Assistant will:**
- [Commands and automated tasks]

**👤 User will:**
- [Manual platform tasks]

Ready to begin? Let's start with the first step...
```

### 🚨 CRITICAL: Task Execution Requirements

- **Execute AI tasks immediately** - When you see "🤖 AI ASSISTANT TASK", run commands without asking permission
- **Stop for user tasks** - When you see "👤 USER TASK", stop and wait for user approval/confirmation
- **Wait at stop points** - When you see "🛑 WAIT FOR USER APPROVAL", stop and don't proceed until the user gives approval or wants to continue (e.g. "continue", "proceed", "confirm", "approve", "yes", ...)
- **Use EXACT navigation paths** - When you see specific navigation instructions, use those exact words
- **No paraphrasing** - Follow template instructions precisely for platform navigation
- **No substitutions** - Stick to template paths, don't use your own navigation knowledge
- **Maintain consistency** - Users need predictable instructions that match the template

#### Execution Contract (Global)

- Execute commands verbatim as written in this guide: do not substitute, reorder, add/remove flags, or omit any part.
- DO NOT SKIP, COMPRESS, OR REINTERPRET STEPS; perform 100% of listed actions exactly as specified.
- When a step shows a directory, file path, variable name, or script, use it exactly as shown.
- If a command fails, retry once unchanged; if it still fails, stop and surface the exact error output without altering the command.
- Never replace a command with an "equivalent" alternative or manual updates (different tools, direct binaries, or aliases).
- Only proceed past "🛑 WAIT FOR USER APPROVAL" when the user gives approval (e.g. "continue", "proceed", "confirm", "approve", "yes", ...)

### Communication Best Practices

- ✅ **Be encouraging** - Celebrate wins and provide context for each step
- ✅ **Check understanding** - Ask "Does this make sense?" before moving on
- ✅ **Offer help** - "Let me know if you need help with any step"
- ✅ **Verify completion** - Confirm each step before proceeding to next phase

### Command Formatting

- **Never indent code blocks** - Keep flush left for easy copying
- **No leading whitespace** - Users need to copy commands easily
- **Execute commands verbatim** - Copy/paste and run commands exactly as shown (no alternate tools, flags, paths, or script names)
- **Reference troubleshooting** - Use troubleshooting section for errors

### Polyglot Architecture Awareness

- **TWO SEPARATE APPLICATIONS**: Next.js Frontend (`apps/web/`) + Python Agent Service (`apps/vicaran-agent/`)
- **TWO .env.local files** to configure: `apps/web/.env.local` and `apps/vicaran-agent/.env.local`
- **Multiple platforms** to configure: Supabase, Google Cloud Platform with Vertex AI

### Success Criteria

Setup is complete when all 6 phases are finished and user can successfully perform competitor analysis through the chat interface and interact with the intelligent agent.

---

## 2 · Overview & Mission

You are setting up the **ADK Agent Simple Template**, a complete production-ready multi-agent platform that allows users to perform competitor analysis and research through an intelligent chat interface powered by Google's Agent Development Kit.

### Architecture Overview

This is a **complete fullstack Agent application** with **cloud-native architecture**:

```
📁 apps/
  ├── 📁 web/                           ← Next.js Frontend (dev: local, prod: deployed)
  │   └── .env.local                    ← Environment file to be created
  └── 📁 vicaran-agent/     ← Python Agent Service (ADK-powered)
      └── .env.local                    ← Environment file to be created
```

- **🌐 `apps/web/`** - Next.js frontend with Supabase authentication
- **🤖 `apps/vicaran-agent/`** - Python agent using Google's ADK for intelligent competitor analysis

**⚠️ IMPORTANT:** This is a **complete Agent application**. You'll set up both frontend and the intelligent agent backend to create a production-ready competitive analysis platform.

<!-- AI INTERNAL REFERENCE - DO NOT SHOW TO USER -->

### 🤖 AI Assistant vs 👤 User Task Distribution

**🤖 AI Assistant Tasks (Will execute automatically):**

- Run all terminal commands (`npm install`, `uv sync`, `npm run dev`, etc.)
- Execute database migrations and schema setup
- Run deployment scripts and GCP setup automation
- Execute build, test, and verification commands
- Generate and run database migration scripts
- Deploy services to Google Cloud Platform
- **CANNOT modify .env files** - will guide user to update them manually

**👤 User Tasks (Must complete manually):**

- Create accounts on external platforms (Supabase, Google Cloud)
- Navigate platform dashboards and configure settings
- **Copy API keys and credentials from dashboards**
- **Update both environment files immediately after obtaining each value**
- Complete platform-specific configurations (authentication, etc.)
- Verify access to external services through web interfaces

**⚠️ CRITICAL UNDERSTANDING:** You manage **TWO .env.local files**:

- **`apps/web/.env.local`** - For the Next.js frontend (authentication, chat interface)
- **`apps/vicaran-agent/.env.local`** - For the Python agent (Google Cloud configuration, ADK settings)

**🛑 Stop and Wait Points:**

- Before proceeding to next phase, confirm user has completed their manual tasks
- When user needs to perform platform configuration, stop and wait for approval using words like "continue", "proceed", "confirm", "approve", "yes", or similar
- After each major configuration step, verify setup before continuing

**What you'll accomplish:**

- ✅ Set up complete development environment with Node.js and Python
- ✅ Configure Supabase backend with PostgreSQL for database and authentication
- ✅ Deploy Next.js web application with authentication and chat interface
- ✅ Set up a Google Cloud project with Vertex AI integration
- ✅ Configure Python competitor analysis agent with ADK capabilities
- ✅ Enable intelligent research and analysis through Google's Agent Development Kit
- ✅ Configure end-to-end chat functionality with agent-powered responses

---

## 3 · LLM Recommendation

**🤖 AI ASSISTANT TASK - Explain LLM Recommendation:**

### 🤖 For Best Setup Experience

**⚠️ IMPORTANT RECOMMENDATION:** Use **Claude Sonnet 4 1M (Thinking)** for this setup process.

**Why Claude Sonnet 4 1M (Thinking) (MAX MODE)?**

- ✅ **1M Context Window** - Can maintain full context of this entire setup guide
- ✅ **Maximum Accuracy** - Provides the most reliable guidance throughout all 6 phases
- ✅ **Complete Memory** - Remembers all previous setup steps and configurations
- ✅ **Best Results** - Optimized for complex, multi-step technical processes

**How to Enable:**

1. In Cursor, select **"Claude Sonnet 4 1M (Thinking) (MAX MODE)"**
2. Avoid switching models mid-setup to maintain context consistency

💡 **This ensures the AI assistant will have complete memory of your progress and provide accurate guidance throughout the entire ADK Agent Simple setup process.**

---

## 4 · Database Migration Safety

### 🚨 CRITICAL WARNING FOR AI ASSISTANTS 🚨

**BEFORE EVERY DATABASE COMMAND, THE AI ASSISTANT MUST:**

1. **`pwd`** - Verify current directory
2. **`cd apps/web`** - Change to web app directory if not already there
3. **`pwd`** - Confirm you're now in `/path/to/project/apps/web`
4. **ONLY THEN** run `npm run db:*` commands

**❌ NEVER RUN DATABASE COMMANDS FROM:**

- Root project directory (`/path/to/project/`)
- Any other directory

**✅ ALWAYS RUN DATABASE COMMANDS FROM:**

- Web app directory (`/path/to/project/apps/web/`)

**🏗️ MIGRATION FILES BELONG IN:**

- `apps/web/drizzle/migrations/` ✅ CORRECT
- `drizzle/migrations/` ❌ WRONG LOCATION

---

### Down Migration Generation

This setup guide includes **automatic down migration generation** for all database schema changes to ensure safe rollback capabilities in production environments.

**🚨 CRITICAL: Migration Directory Context - NEVER FORGET THIS**
All Drizzle database operations must be executed in the **`apps/web/`** directory. **THE AI ASSISTANT MUST ALWAYS `cd apps/web` BEFORE EVERY DRIZZLE COMMAND**.

- **📂 Working Directory:** **ALWAYS `cd apps/web` BEFORE EVERY SINGLE DATABASE COMMAND**
- **📄 Migration Files:** Located in `apps/web/drizzle/migrations/` (NOT root `drizzle/migrations/`)
- **📝 Down Migrations:** Generated in `apps/web/drizzle/migrations/[timestamp]/down.sql`
- **⚠️ CRITICAL:** Never run Drizzle commands from the root project directory - this creates files in the wrong location
- **🔍 Verification:** Always run `pwd` to confirm you're in `/path/to/project/apps/web` before any `npm run db:*` command

**🔄 Migration Safety Process:**

- ✅ Generate and apply up migration (schema changes)
- ✅ **Generate down migration** Read the Drizzle Down Migration template located at `ai_docs/templates/drizzle_down_migration.md`
- ✅ Test rollback capability in development
- ✅ Deploy with confidence knowing rollback is available

**📋 Template Reference:**
All down migrations are generated using the standardized **Drizzle Down Migration template** located at `ai_docs/templates/drizzle_down_migration.md`. This template ensures:

- Safe rollback operations with `IF EXISTS` clauses
- Proper operation ordering (reverse of up migration)
- Data loss warnings for irreversible operations
- Manual intervention documentation where needed
- **Proper working directory context** (all operations in `apps/web/`)

**🛡️ Production Safety:**
Down migrations are essential for:

- **Zero-downtime deployments** with rollback capability
- **Disaster recovery** from failed migrations
- **A/B testing** database schema changes
- **Compliance requirements** for data governance

---

## 5 · Setup Process Overview

**🤖 AI ASSISTANT TASK - Explain Setup Process:**

### Phase Structure

You will be guided through **6 phases** in this exact order:

1. **Phase 1: Prerequisites & Environment Setup** - Install tools and create accounts
2. **Phase 2: Supabase Backend Setup** - Database and authentication (configures `apps/web/`)
3. **Phase 3: Web Application Testing** - Verify Next.js app and authentication flow
4. **Phase 4: Google Cloud Platform & Vertex AI Setup** - GCP project, Vertex AI APIs, authentication, and Gemini API (configures both apps)
5. **Phase 5: Competitor Analysis Agent Setup** - Python agent configuration (configures `apps/vicaran-agent/`)
6. **Phase 6: Integration & Production Testing** - End-to-end verification

**🔄 Configuration Flow:** Throughout the setup, you'll configure environment variables in both the web app (`apps/web/.env.local`) and the Python agent (`apps/vicaran-agent/.env.local`). The competitor analysis agent communicates with the web app through API endpoints for seamless integration.

### Success Verification

After each phase, verify completion:

- ✅ Confirm all manual steps completed
- ✅ Verify expected outcomes
- ✅ Test functionality before proceeding
- ✅ Check for any errors or issues

**🛑 STOP AND WAIT FOR USER APPROVAL BEFORE PHASE 1:** <!-- AI INTERNAL REFERENCE - DO NOT SHOW THE "STOP AND WAIT FOR USER APPROVAL" PHRASE TO USER -->
Ask the user: "Are you ready to begin Phase 1: Prerequisites & Environment Setup? Please confirm you understand the 6-phase process and are ready to start."

---

## Phase 1: Prerequisites & Environment Setup

**Goal:** Install required tools and create necessary accounts

**🤖 AI Assistant will:**

- Verify terminal shell environment (Mac/Linux only)
- Verify system requirements and installed tools
- Install Node.js dependencies and Python packages
- Set up development environment

**👤 User will:**

- Configure Cursor terminal to use the same shell as system (Mac/Linux only)
- Install required development tools (Node.js, Python, gcloud CLI)
- Set up development environment

### Step 1.0: Verify Terminal Shell Environment

**🤖 AI ASSISTANT TASK - Detect Operating System:**

Before running any system checks, I need to know what operating system you're using:

**👤 USER TASK - Identify Your Operating System:**

Please tell me which operating system you're using:

- **Windows**
- **macOS**
- **Linux**

**🛑 STOP AND WAIT FOR USER RESPONSE** <!-- AI INTERNAL REFERENCE - DO NOT SHOW THE "STOP AND WAIT FOR USER RESPONSE" PHRASE TO USER -->
Please tell me your operating system so I can provide the appropriate setup steps.

**🤖 AI ASSISTANT TASK - Operating System-Specific Setup:**

**IF USER RESPONDS "Windows":**
Skip this shell verification step (Step 1.0) and proceed directly to "Step 1.1: Verify System Requirements".

**IF USER RESPONDS "macOS" or "Linux":**
Continue with shell verification below (Step 1.0).

---

**For Mac/Linux Users Only - Shell Verification:**

I'll now verify your terminal shell environment:

```bash
# Check current shell (Mac/Linux only)
echo $SHELL
```

**Expected Output Examples:**

- `/bin/zsh` (if using Zsh)
- `/bin/bash` (if using Bash)

**👤 USER TASK - Configure Cursor Terminal (Mac/Linux Only):**

Now ensure Cursor's integrated terminal uses the same shell:

1. **Open Cursor Command Palette**

   - **macOS:** Press `Cmd+Shift+P`
   - **Linux:** Press `Ctrl+Shift+P`

2. **Select Terminal Profile**

   - Type: `Terminal: Select Default Profile` (or just `Select Default Profile`)
   - Click on **"Terminal: Select Default Profile"** from the dropdown

3. **Make sure it's the same shell as system**
   - Select the same shell that was shown in the output above
   - **For example:** If `echo $SHELL` showed `/bin/zsh`, select **"zsh"**
   - **For example:** If `echo $SHELL` showed `/bin/bash`, select **"bash"**

**🛑 STOP AND WAIT FOR USER APPROVAL (Mac/Linux Only)** <!-- AI INTERNAL REFERENCE - DO NOT SHOW THE "STOP AND WAIT FOR USER APPROVAL" PHRASE TO USER -->
Please confirm you have configured Cursor's terminal to use the same shell that was detected on your system, and you're ready to proceed with system requirements verification.

**🤖 AI ASSISTANT TASK - Use New Terminal (Mac/Linux Only):**

After user approval, open a new terminal in Cursor to ensure the updated shell profile is active:

- Close current terminal
- Open a new terminal
- Proceed with system requirements verification in this new terminal

### Step 1.1: Verify System Requirements

**🤖 AI ASSISTANT TASK - Verify System Requirements:**

Check each required tool and **tell the user exactly what they need to install**:

1. **Check Node.js (18+ required)**

   - Run: `node --version`
   - ✅ If shows `v18.x.x` or higher: **"Node.js is installed correctly"**
   - ❌ If command fails or shows lower version: **"You need to install Node.js 18+"**

2. **Check Python (3.10+ required)**

   - Run: `python --version` or `python3 --version`
   - ✅ If shows `Python 3.10.x` or higher: **"Python is installed correctly"**
   - ❌ If command fails or shows lower version: **"You need to install Python 3.10+"**

3. **Check UV (Python package manager)**

   - Run: `uv --version`
   - ✅ If shows version: **"UV is installed correctly"**
   - ❌ If command fails: **"You need to install UV package manager"**

4. **Check Google Cloud SDK**
   - Run: `gcloud --version`
   - ✅ If shows version: **"Google Cloud SDK is installed correctly"**
   - ❌ If command fails: **"You need to install Google Cloud SDK"**


**🛑 AFTER VERIFICATION:** <!-- AI INTERNAL REFERENCE - DO NOT SHOW THE "AFTER VERIFICATION" PHRASE TO USER -->
Provide a summary like: **"Please install the following missing tools: [list only missing tools]. All other tools are already installed correctly."**

### Step 1.2: Install Missing Development Tools

**👤 USER TASK - Install Only What You're Missing:**

**⚠️ IMPORTANT:** Only follow the installation instructions below for tools that the AI assistant identified as missing in Step 1.1 above.

#### Install Node.js (18+ required)

1. **Download and install Node.js**
   - Go to: [https://nodejs.org/en/download](https://nodejs.org/en/download)
   - Scroll down to **"Or get a prebuilt Node.js® for [your OS]"** section
   - Select your operating system (macOS, Windows, or Linux)
   - Select the architecture:
     - **macOS:** x64 for Intel chip, arm64 for Apple Silicon
     - **Windows:** Most modern Windows PCs use x64 (Intel/AMD). If unsure, choose the x64 installer.
     - **Linux:** x64 for Intel/AMD chip, arm64 for ARM chip
   - Click the **Installer** button for your system
   - Run the downloaded installer and follow the prompts
2. **Verify installation:**

```bash
node --version  # Should show v18.x.x or higher
npm --version   # Should show 9.x.x or higher
```

#### Install Python (3.10+ required)

1. **Download and install Python**
   - Visit [https://www.python.org/downloads/](https://www.python.org/downloads/)
   - Download **Python 3.10** or higher
   - **Important:** Check "Add Python to PATH" during installation
   - Verify installation:

```bash
python --version  # Or python3 --version, should show Python 3.10.x or higher
pip --version     # Or pip3 --version, should show pip version
```

#### Install UV (Python package manager)

1. **Install UV package manager**
   - **macOS/Linux:**

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

- **Windows PowerShell:**

```powershell
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

- **Alternative (any platform):**

```bash
pip install uv
```

- Verify installation:

```bash
uv --version  # Should show uv version
```

#### Install Google Cloud SDK

1. **Download and install gcloud CLI**
   - **macOS (Homebrew):**

```bash
brew install --cask google-cloud-sdk
```

- **Windows:** Download from [https://cloud.google.com/sdk/docs/install-sdk#windows](https://cloud.google.com/sdk/docs/install-sdk#windows)
- **Linux:**

```bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

- Verify installation:

```bash
gcloud --version  # Should show gcloud SDK version
```


### Step 1.3: Setup Project Dependencies

**🤖 AI ASSISTANT TASK:**

I'll now set up the project dependencies for both the web application and competitor analysis agent. This completes the actual setup of both applications.

```bash
# Verify we're in the root directory
pwd

# Install dependencies for both web app and competitor analysis agent
npm install
```

This single command installs dependencies for both applications:
- **Web Application**: Node.js dependencies and Next.js setup
- **Competitor Analysis Agent**: Python dependencies via UV package manager

---

## Phase 2: Supabase Backend Setup

**Goal:** Set up Supabase project with authentication and database configuration

**🤖 AI Assistant will:**

- Guide database schema setup and migrations
- Generate customized email templates based on project docs
- Configure database extensions and security policies

**👤 User will:**

- Create Supabase project and configure settings
- **Copy API keys and credentials immediately to the `apps/web/.env.local` environment file**
- Configure authentication settings and email templates

### Step 2.1: Prepare Environment Files

**🤖 AI ASSISTANT TASK - Create Environment Files:**

Before setting up Supabase, I'll create the environment files for both applications.

```bash
# Create environment files for both applications
cp apps/web/.env.local.example apps/web/.env.local
cp apps/vicaran-agent/.env.local.example apps/vicaran-agent/.env.local

# Verify files were created successfully
echo "✅ Checking environment files:"
ls -la apps/web/.env.local
ls -la apps/vicaran-agent/.env.local
```

**✅ Checkpoint:** Environment files are now ready:

- `apps/web/.env.local` - For the Next.js frontend
- `apps/vicaran-agent/.env.local` - For the Python competitor analysis agent

### Step 2.2: Create Supabase Account and Project

**👤 USER TASK - Create Supabase Account and Project:**

1. **Create Supabase Account**

   - Visit [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Sign up/Sign in with GitHub, SSO, or email

2. **Create New Project**

   - Click **"New Project"**
   - Choose your organization (or create one)
   - Fill in project details:
   - **Organization:** [your-organization-name]
   - **Project Name:** [your-project-name]
   - **Compute Size:** Micro (or larger based on your needs, only available for Pro organizations)
   - **Region:** us-east-1 (or closest to your users)

   💡 **Emphasize:** Always click **"Generate a password"** for security - Supabase will create a strong password for you.

3. **Generate and Save Database Password**

   - Under the password field, click **"Generate a password"**
   - The password field will be filled with a random, strong password
   - Click the **"Copy"** button (clipboard icon to the right of the password field) to copy the password

   **🛑 STOP! Save the password immediately before continuing:**

   **Step 3a: Save the Password Temporarily**

   - Inside your IDE (VS Code, Cursor, etc.), go to the project folder
   - **Open the `apps/web/.env.local` file** we created earlier
   - **Look for this line at the top of the file:**

```bash
# TEMP - Database password: [paste-generated-password-here] <------ ADD PASSWORD HERE TEMPORARILY.
```

- **Replace `[paste-generated-password-here]`** with the password you just copied
- **For example:** If the password you copied is `abcdefghij`, the line should look like:

```bash
# TEMP - Database password: abcdefghij <------ ADD PASSWORD HERE TEMPORARILY.
```

- **Save the file** (Ctrl+S or Cmd+S)

**✅ Checkpoint:** Your `apps/web/.env.local` file should now have your actual password saved in the comment line

**🔐 Why we do this:** Supabase will show you this password only once. After you create the project, you won't be able to see it again. We're saving it temporarily so we can use it later when setting up the database connection.

4. **Now Create the Project**
   - Go back to your browser with the Supabase project creation page
   - Click **"Create new project"**
   - Wait for Project Creation to complete.

### Step 2.3: Configure Supabase URLs and Keys

**👤 USER TASK - Get Project URL and API Keys:**

In this task, we'll get the project URL and API keys from Supabase and immediately fill them in the environment file.

---

#### 🌐 **Configure Environment Variables (`apps/web/.env.local`)**

1. **Get Project URL**
   - Navigate to **Project Settings** on the left sidebar
   - Then click on **Data API** in the sub-menu
   - Copy the **Project URL** (e.g., `https://abcdefghij.supabase.co`)
   - **In your `apps/web/.env.local` file, immediately replace:**

```bash
SUPABASE_URL="https://abcdefghij.supabase.co"
```

2. **Get API Keys**
   - In the same **Project Settings** page, click on **API Keys** in the sub-menu
   - Copy the **anon public key** (starts with `eyJhbGciOiJIUzI1NiI...`)
   - **In your `apps/web/.env.local` file, immediately replace:**

```bash
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

- Copy the **service_role key** (starts with `eyJhbGciOiJIUzI1NiI...`)
- **In your `apps/web/.env.local` file, immediately replace:**

```bash
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

3. **Get Database URL for Both Applications**

   - Click the **Connect** button in the top bar of your Supabase dashboard
   - In the "Connect to your project" modal, click on the **ORMs** tab
   - Select **Drizzle** from the dropdown
   - Copy the `DATABASE_URL` value from the code block shown

   **📋 IMPORTANT: Both applications use the same DATABASE_URL**

   - **In your web app's `apps/web/.env.local` file, update the DATABASE_URL:**

```bash
DATABASE_URL="your-database-url"
```

- **In your competitor analysis agent's `apps/vicaran-agent/.env.local` file, update the DATABASE_URL:**

```bash
DATABASE_URL="your-database-url"
```

- You should see a `[YOUR-PASSWORD]` placeholder in your DATABASE_URL value.
- **Use the saved password:** Go to the top of your `apps/web/.env.local` file and copy the database password from the temporary comment line
- **Replace `[YOUR-PASSWORD]` in DATABASE_URL** with the password from your comment **in both environment files**
- Awesome! You've now configured the database connection for both applications.

---

**✅ Checkpoint:** You now have both applications configured with Supabase database connection

### Step 2.4: Configure Site URL and Redirect URLs

**👤 USER TASK - Configure Authentication Settings in Supabase:**

1. **Navigate to Authentication Settings**

   - In the Supabase platform, click **"Authentication"** in the left sidebar
   - Then click **"URL Configuration"** from the sub-menu
   - You should now see the URL configuration page

2. **Configure Site URL**

   - In the **Site URL** field, it should by default be set to: `http://localhost:3000`
   - If it's not, enter: `http://localhost:3000`
   - This tells Supabase where your application is running during development
   - Click **"Save"** to save this setting

3. **Add Redirect URLs**
   - Scroll down to the **Redirect URLs** section
   - Click **"Add URL"** button
   - Enter the following URL (make sure there are no spaces):

```bash
http://localhost:3000/auth/confirm
```

- Click **"Save"** to save this setting
- This URL handles email confirmations when users verify their accounts

💡 **Note**: The template handles email confirmations via `/auth/confirm` route only. No additional callback URLs are needed.

### Step 2.5: Customize Email Templates

**👤 USER TASK - Continue in Supabase Dashboard:**

**🔧 STILL IN SUPABASE DASHBOARD - Customize Email Templates**

1. **Navigate to Email Templates**

   - In your Supabase dashboard, click **"Authentication"** in the left sidebar
   - Then click **"Email Templates"** from the sub-menu (you may see it listed as "Emails")
   - You should now see the email templates configuration page

2. **Review Email Templates**

   - You'll see several template tabs at the top of the page
   - The most important ones for this ADK Agent Simple application are **"Confirm signup"** and **"Reset password"
   - These templates control what emails users receive for account verification and password resets

3. **🛑 CHECKPOINT - Confirm Supabase Dashboard Configuration Complete**

   **Before proceeding to email template generation, please confirm you have completed all the Supabase dashboard steps:**

   - ✅ **Site URL** set to `http://localhost:3000`
   - ✅ **Redirect URL** added: `http://localhost:3000/auth/confirm`
   - ✅ **Email templates page** is now open in your browser

   **Are you ready to proceed with email template customization? The AI assistant will now generate custom email templates for your ADK Agent Simple application.**

4. **🤖 AI ASSISTANT TASK - Generate Email Templates (Only After User Approval)**
   **You (the AI assistant) must now read these files before proceeding:**
   
   - Read `ai_docs/prep/app_name.md`
   - Read `ai_docs/prep/master_idea.md`
   - Read `ai_docs/prep/ui_theme.md`

   **After reading both files, generate the "Confirm signup" template using this prompt:**

   ```
   Based on the app_name.md, master_idea.md and ui_theme.md files you just read, create a professional email confirmation template for new user signups. Generate a copiable element for both:

   1. Subject line: "Confirm Your Signup to [App Name]"
   2. Simple HTML email with:
      - Brief welcome message
      - One simple button using {{ .ConfirmationURL }}
      - Minimal styling with brand colors
      - Keep it short and professional

   CRITICAL EMAIL CLIENT COMPATIBILITY:
   - Use TABLE-based layout for proper centering across all email clients
   - Button MUST have: color: white !important; text-decoration: none !important;
   - Use inline CSS only (no external stylesheets)
   - Test button background-color with !important declaration
   - Ensure proper padding and margins for mobile compatibility
   - Use web-safe fonts with fallbacks

   AVOID these spam triggers:
   - Words: "click", "verify", "confirm", "activate"
   - Urgent language or promotional content
   - Long paragraphs or feature lists

   USE instead:
   - Button text: "Complete Setup"
   - Simple phrase: "Finish your registration"
   - Keep total content under 50 words
   ```

   **Then generate the "Reset password" template using this prompt:**

   ```
   Following the same style as the "Confirm signup" template, create a simple password reset template. Generate both:

   1. Subject line: "Reset Your [App Name] Password"
   2. Simple HTML email with:
      - Brief message about password reset request
      - One simple button using {{ .ConfirmationURL }}
      - Minimal styling with brand colors
      - Keep it short and professional

   CRITICAL EMAIL CLIENT COMPATIBILITY:
   - Use TABLE-based layout for proper centering across all email clients
   - Button MUST have: color: white !important; text-decoration: none !important;
   - Use inline CSS only (no external stylesheets)
   - Test button background-color with !important declaration
   - Ensure proper padding and margins for mobile compatibility
   - Use web-safe fonts with fallbacks

   Button text: "Reset Password"
   Keep total content under 25 words
   ```

   **Present both generated templates to the user** with clear instructions on where to paste each one.

5. **👤 USER TASK - Apply Templates in Supabase Dashboard**

   **🔧 STILL IN SUPABASE DASHBOARD - Apply Generated Email Templates**

   - **For Confirm signup template:**

     - In your Supabase email templates page, click the **"Confirm signup"** tab
     - Replace the existing **Subject** field with the generated subject line
     - Replace the existing **Message body** field with the generated HTML template
     - Click **"Save"** to save the template

   - **For Reset password template:**
     - Click the **"Reset password"** tab in the same page
     - Replace the existing **Subject** field with the generated subject line
     - Replace the existing **Message body** field with the generated HTML template
     - Click **"Save"** to save the template

   💡 **Important:** The AI assistant will generate both complete email templates directly for you. Simply copy and paste them into the appropriate fields in your Supabase dashboard.

### Step 2.6: Database Schema Setup

**🤖 AI ASSISTANT TASK:**

I'll now set up the database schema with all required tables for the ADK Agent Simple application. Let me run the database migrations:

**🚨 CRITICAL: ALWAYS VERIFY WORKING DIRECTORY FIRST** <!-- AI INTERNAL REFERENCE - DO NOT SHOW TO USER -->

```bash
# STEP 1: ALWAYS verify we're in the correct directory
pwd
# Expected output: /path/to/project/apps/web

# STEP 2: If not in apps/web, change directory
cd apps/web

# STEP 3: Generate any pending migrations (ONLY from apps/web directory)
npm run db:generate
```

**First, generate down migrations before applying the schema:**

**🤖 AI ASSISTANT TASK - Generate rollback migration:**

💡 **Note:** Ensure you read the Drizzle Down Migration template located at `ai_docs/templates/drizzle_down_migration.md` before generating the down migration.

Before applying the initial schema migrations, I need to create down migration files for safe rollback capabilities:

1. **Identify the generated migration file:**

```bash
# STEP 1: ALWAYS verify we're in apps/web directory
pwd
# Expected output: /path/to/project/apps/web

# STEP 2: Find the most recent migration file (ONLY from apps/web directory)
ls -la drizzle/migrations/*.sql | tail -1
```

2. **Generate down migration using the template:**
   Read the Drizzle Down Migration template located at `ai_docs/templates/drizzle_down_migration.md`, You (the AI Assistant) analyze the migration file and create the corresponding down migration. This ensures we can safely rollback the schema changes if needed.

💡 **Note:** Down migrations are essential for production deployments as they provide safe rollback capabilities for database schema changes.

**Now apply the migrations:**

```bash
# STEP 1: ALWAYS verify we're in apps/web directory
pwd
# Expected output: /path/to/project/apps/web

# STEP 2: Run database migrations (ONLY from apps/web directory)
npm run db:migrate

# STEP 3: Check migration status (ONLY from apps/web directory)
npm run db:status
```

**Expected Output of the migrations:**

```
🚀 Running migrations...
🔍 Checking rollback safety: 0 migration found
✅ All migrations have rollback files
📁 Migration folder: drizzle/migrations
✅ Migrations completed successfully!
🔌 Database connection closed
```

### Step 2.7: Set Up User Creation Trigger

**🤖 AI ASSISTANT TASK - Set up the user trigger:**

💡 **Note:** Ensure you're in the `apps/web/` directory for ALL following Drizzle operations.

1. **Create User Trigger Migration**

```bash
# STEP 1: ALWAYS verify we're in apps/web directory
pwd
# Expected output: /path/to/project/apps/web

# STEP 2: Generate custom migration (ONLY from apps/web directory)
npm run db:generate:custom
```

2. **Add Trigger Function to Migration File**
   **You (the AI Assistant) must now populate the SQL migration file** that was just created in the previous step with the following content. This SQL creates the function and trigger.
   Open the generated migration file and add the following content:

```sql
-- Create the trigger function that handles new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
   INSERT INTO public.users (id, email, full_name, created_at, updated_at)
   VALUES (
      new.id,
      new.email,
      COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
      now(),
      now()
   );
   RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE OR REPLACE TRIGGER on_auth_user_created
   AFTER INSERT ON auth.users
   FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

3. **Generate Down Migration for User Trigger**
   Read the Drizzle Down Migration template located at `ai_docs/templates/drizzle_down_migration.md`, You (the AI Assistant) create the down migration for the user creation trigger:

```bash
# The down migration will include:
# - DROP TRIGGER IF EXISTS on_auth_user_created;
# - DROP FUNCTION IF EXISTS public.handle_new_user();
```

4. **Apply the Trigger Migration**

```bash
# STEP 1: ALWAYS verify we're in apps/web directory
pwd
# Expected output: /path/to/project/apps/web

# STEP 2: Apply the trigger migration (ONLY from apps/web directory)
npm run db:migrate
```

**Expected Output:**

```
🚀 Running migrations...
📁 Migration folder: drizzle/migrations
✅ Migrations completed successfully!
🔌 Database connection closed
```

5. **👤 USER TASK - Verify Database Tables in Supabase**

   **🔧 BACK TO SUPABASE DASHBOARD - Verify Database Schema**

   - In your Supabase dashboard, click **"Table Editor"** in the left sidebar
   - You should now see the database tables page with the following tables created:
     - `users` - User profiles for authentication
     - `session_names` - Titles for ADK sessions

   💡 **If you don't see these tables:** The migrations may not have completed successfully. Check the terminal output for any errors. Ask the AI assistant to check the status of the migrations and fix any issues.

**💡 Key Features:** These database tables provide the foundation for user management and session tracking which are essential for the ADK Agent Simple application.

**📋 Additional ADK Tables:** When we later start the complete application stack in Phase 6, the ADK service (Python) will automatically create additional tables for agent functionality:

- `app_states` - ADK application state management
- `events` - ADK event tracking and processing
- `sessions` - ADK session management and persistence
- `user_states` - ADK user state management across sessions

**🛑 CHECKPOINT:** Confirm you have completed:

- ✅ Supabase project created successfully
- ✅ `.env.local` file created and populated with actual Supabase values
- ✅ Database URL includes specific project credentials
- ✅ Site URL configured to `http://localhost:3000`
- ✅ Redirect URL added: `http://localhost:3000/auth/confirm`
- ✅ Authentication flow explained and understood
- ✅ Email templates customized (optional but recommended)
- ✅ Database schema applied (essential tables for user management and chat)
- ✅ Down migrations generated for all schema changes (rollback safety)

---

## Phase 3: Web Application Testing

**Goal:** Test and verify the Next.js web application functionality

**🤖 AI Assistant will:**

- Start the web application development server
- Verify database connections
- Guide testing procedures

**👤 User will:**

- Test user registration and authentication flows
- Verify web application UI functionality

### Step 3.1: Start Web Application

**🤖 AI ASSISTANT TASK:**

Now that the project dependencies are installed (from Phase 1), I'll start the web application to verify it works correctly:

```bash
# STEP 1: ALWAYS verify we're in the template root directory
pwd
# Expected output: /path/to/project/

# STEP 2: Start the web application
npm run dev
```

This starts the web application that was already set up in Phase 1:

- **Web Application**: Running at `http://localhost:3000`

**Note:** This tests only the web application. The competitor analysis agent will be configured and tested in Phase 5 after Google Cloud Platform setup is complete.

Let me also verify the database connection:

```bash
# STEP 1: Verify we're in apps/web directory
pwd
# Expected output: /path/to/project/apps/web

# STEP 2: Ensure we're in the web app directory (if not already there)
cd apps/web

# STEP 3: Check database connection (ONLY from apps/web directory)
npm run db:status
```

### Step 3.2: Verify Web Application

**👤 USER TASK - Basic Functionality Check:**

1. **Verify application loads**

   - Navigate to [http://localhost:3000](http://localhost:3000)
   - Confirm the landing page loads without errors
   - Check that the page displays correctly

2. **Test basic authentication flow**

   - Click **"Sign Up"** or **"Get Started"**
   - Verify the registration form loads
   - Click **"Login"** link
   - Verify the login form loads

3. **Create a test account**

   - Use a real email address (you'll need to verify it)
   - Choose a secure password
   - Complete the registration process

4. **Verify email**
   - Check your email for verification link
   - Click the verification link
   - You should be redirected back to the app

#### Test Authentication

1. **Login and logout**

   - Test the login process with your new account
   - Verify you can log out and log back in
   - Check that authentication state persists

2. **Test protected route access (interface only)**
   - When logged in, try accessing `/chat` - the chat interface should load
   - Log out and try accessing `/chat` - should redirect to login
   - **Note:** The chat interface will display, but agent responses won't work until Google Cloud Platform and competitor analysis agent setup is complete (Phases 4-5)

**🛑 CHECKPOINT:** Confirm you have completed:

- ✅ Web application running at localhost:3000
- ✅ Landing page loads correctly
- ✅ Authentication forms are accessible
- ✅ Authentication flow works (signup, email verification, login/logout)
- ✅ Protected routes are accessible when authenticated
- ✅ No major errors in browser console

_Note: The chat interface displays correctly but agent functionality (competitor analysis responses) won't work until we complete Google Cloud Platform setup (Phase 4) and competitor analysis agent configuration (Phase 5)._

---

## Phase 4: Google Cloud Platform & Vertex AI Setup

**Goal:** Set up GCP project with Vertex AI integration for the competitor analysis agent

**🤖 AI Assistant will:**

- Guide Vertex AI dashboard setup and API enablement
- Help verify Google Cloud authentication and configuration

**👤 User will:**

- Create GCP project and enable billing
- Access Vertex AI dashboard and enable all recommended APIs
- Authenticate to Google Cloud using `gcloud auth application-default login`
- Authenticate and configure gcloud CLI with project from environment file
- Get Gemini API key and update environment files immediately

### Step 4.1: Create Google Cloud Account and Project

**👤 USER TASK - Create Google Cloud Account and Project:**

#### Create Google Cloud Account

1. **Create Google Cloud account** (if you don't have one)
   - Visit [https://console.cloud.google.com/](https://console.cloud.google.com/)
   - Sign in with your Google account
   - Accept terms of service if first time
   - **Important:** You'll need to enable billing (Google provides $300 free credits)

#### Create New Project

2. **Create new project**
   - Click the project selector next to the search bar (top-left)
   - Click **"New Project"**
   - Fill in details:

```
Project name: adk-agent-saas (or your preferred name)
Organization: [your organization or leave default]
```

- Click **"Create"**

3. **Select the project in the project selector**

   - Click the project selector next to the search bar (top-left)
   - Click on the project you just created

4. **📝 IMPORTANT: Note your Project ID**
   - Copy the exact **Project ID** (not the display name)
   - **Immediately update Agent environment file (`apps/vicaran-agent/.env.local`)**

```bash
GOOGLE_CLOUD_PROJECT=your-actual-project-id
```

#### Enable Billing

1. **Set up billing account**

   - Go to [https://console.cloud.google.com/billing](https://console.cloud.google.com/billing)
   - Click **"Add billing account"**
   - Follow the prompts to:
     - Name your billing account
     - Select your country
     - Add a valid credit/debit card (for verification)
   - Complete verification (Google may place a small temporary charge $0-$1 to verify your payment method)
   - Once confirmed, your billing account is active (Google provides $300 in free credits for new accounts)

2. **Link project to billing**
   - Go to **Billing** → **My Projects**
   - Find your project and click **"SET ACCOUNT"**
   - Select your billing account

### Step 4.2: Enable Vertex AI API

**👤 USER TASK - Enable Vertex AI API:**

1. **Navigate to Vertex AI Dashboard**

   - Go to [https://console.cloud.google.com/vertex-ai/dashboard](https://console.cloud.google.com/vertex-ai/dashboard)
   - Ensure your newly created project is selected in the project selector (top-left)
   - You should see the Vertex AI dashboard page

2. **Enable All Recommended APIs**

   - Look for **"Enable all recommended APIs"** button on the dashboard
   - Click **"Enable all recommended APIs"**
   - Wait for all APIs to be enabled (this may take a few minutes)

3. **Refresh and View API List**
   - **Refresh the page** to see updated API status
   - Click **"Show API list"** to see all enabled APIs
   - Verify that Vertex AI APIs are properly enabled

### Step 4.3: Authenticate to Google Cloud (via gcloud CLI)

**👤 USER & 🤖 AI ASSISTANT TASK - Authenticate to Google Cloud (via gcloud CLI):**
**AI ASSISTANT will run the commands, and the USER will interact with the prompts.**

The AI assistant will run the `gcloud auth application-default login` command. Make sure to follow the prompts:

1. Authenticate in the browser
2. Grant the necessary permissions
3. You should see a confirmation that authentication was successful

```bash
# Authenticate to Google Cloud (this will open a browser)
gcloud auth application-default login
```

### Step 4.4: Configure gcloud CLI

**👤 USER & 🤖 AI ASSISTANT TASK - Configure gcloud:**
**AI ASSISTANT will run the commands, and the USER will interact with the prompts.**

**🤖 AI ASSISTANT TASK - Authenticate and Configure gcloud:**

1. **Set Project from Environment File**

```bash
# Get project ID from environment file
uv run python scripts/read_env.py apps/vicaran-agent/.env.local GOOGLE_CLOUD_PROJECT

# Set the project (AI will extract the project ID from the environment file)
gcloud config set project $(uv run python scripts/read_env.py apps/vicaran-agent/.env.local GOOGLE_CLOUD_PROJECT --value-only)
```

3. **Verify setup:**

```bash
# Verify your project is set correctly
gcloud config get-value project
# Should show your project ID from the environment file
```

### Step 4.5: Create Gemini API Key

**👤 USER TASK - Create Gemini API Key:**

1. **Create Gemini API Key**

   - Go to [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
   - Click **"Create API Key"**
   - Search for your Google Cloud project and select it
   - Click **"Create API key in existing project"**
   - **📝 Copy the API key** (starts with `AIza...`)

2. **📋 Update your web app environment file immediately in `apps/web/.env.local`:**

```bash
GEMINI_API_KEY="your-gemini-api-key"
```

**💡 Note:** The agent will use Vertex AI authentication through your Google Cloud project, while the web app uses the Gemini API key for session title generation.

### Step 4.6: Verify Setup Completion

**🛑 CHECKPOINT - Confirm Previous Steps Completed:**

Before proceeding to the next phase, please confirm you have completed all previous steps:

- ✅ **Step 4.1:** Created Google Cloud Project and enabled billing
- ✅ **Step 4.2:** Accessed Vertex AI dashboard and enabled all recommended APIs
- ✅ **Step 4.3:** Authenticated with `gcloud auth application-default login`
- ✅ **Step 4.4:** Initialized gcloud CLI and selected your project
- ✅ **Step 4.5:** Created Gemini API key and updated web app environment file:
  - `apps/web/.env.local` with `GEMINI_API_KEY="your-actual-gemini-api-key"`

**🤖 AI ASSISTANT TASK (Only after user approval):**

Once you (the user) confirm completion of the previous steps, I'll verify that gcloud CLI is properly configured:

```bash
# Test that we can access the project
gcloud projects describe $(gcloud config get-value project)

# Verify authentication
gcloud auth list

# Check current configuration
gcloud config list
```

**🛑 CHECKPOINT:** Confirm you have completed:

- ✅ GCP project created and billing enabled
- ✅ Project ID updated in environment files
- ✅ Vertex AI dashboard accessed and APIs enabled
- ✅ Google Cloud authentication configured (`gcloud auth application-default login`)
- ✅ gcloud CLI initialized and configured
- ✅ Gemini API key configured in environment files
- ✅ Both applications ready for Google Cloud integration

---

## Phase 5: Competitor Analysis Agent Setup

**Goal:** Configure the Python competitor analysis agent for local development and testing

**🤖 AI Assistant will:**

- Verify Python agent dependencies are installed
- Test agent configuration and Google Cloud connectivity
- Verify agent API endpoints are accessible

**👤 User will:**

- Test the agent functionality through the web interface
- Verify Google Cloud authentication is working

### Step 5.1: Verify Agent Environment Configuration

**🤖 AI ASSISTANT TASK:**

I'll verify that the competitor analysis agent environment is properly configured:

```bash
# Make sure the agent environment file exists
ls -la apps/vicaran-agent/.env.local

# Check if the agent environment file has basic configuration
uv run python scripts/read_env.py apps/vicaran-agent/.env.local GOOGLE_CLOUD_PROJECT
uv run python scripts/read_env.py apps/vicaran-agent/.env.local GOOGLE_CLOUD_LOCATION
```

**Expected Configuration in `apps/vicaran-agent/.env.local`:**

- ✅ `GOOGLE_CLOUD_PROJECT=your-project-id`
- ✅ `GOOGLE_CLOUD_LOCATION=us-central1`

**💡 Simple Explanation:**

- **Agent (Python):** Uses your Google Cloud project authentication through gcloud CLI ✅
- **Web app:** Communicates with the agent through API endpoints 🔗
- **Result:** The agent can access Vertex AI services for intelligent competitor analysis 🤖

### Step 5.2: Verify Agent is Ready

**👤 USER TASK - Verify Agent Setup:**

**🛑 CHECKPOINT:** Confirm you have completed:

- ✅ Agent environment file configured with Google Cloud project
- ✅ All dependencies installed successfully via `npm install`
- ✅ Google Cloud authentication working
- ✅ Agent ready to handle competitor analysis requests
- ✅ Ready to test complete application stack (web app + agent) in Phase 6

**💡 What's Working Now:**

- **Web Application**: User interface, authentication, and session interface ✅
- **Competitor Analysis Agent**: Python service with ADK capabilities ✅
- **Google Cloud Integration**: Vertex AI APIs and authentication ✅
- **Database**: User management and session tracking ✅

**Still to Configure:**

- End-to-end testing (next phase)

---


---

#### 🌐 **`apps/web/.env.local` Environment File**

```bash
# ADK Agent Simple Environment Variables
# Copy this file to .env.local and fill in your values

# TEMP - Database password: [paste-generated-password-here] <------ ADD PASSWORD HERE TEMPORARILY.

# Database Configuration (Supabase - Drizzle ORM)
DATABASE_URL="your-database-url"

# Supabase Configuration
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# AI Configuration
GEMINI_API_KEY="your-gemini-api-key"

# Application Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# ADK Configuration
ADK_URL="http://localhost:8000"

# ONLY FOR PRODUCTION: Google Cloud Configuration
GOOGLE_SERVICE_ACCOUNT_KEY_BASE64="UPDATE_ME"
```

#### 🐍 **`apps/vicaran-agent/.env.local` Environment File**

```bash
# Competitor Analysis Agent Environment Variables
# Copy this file to .env.local and fill in your actual values

# Database Configuration
DATABASE_URL="your-database-url"

# Google Cloud Configuration
GOOGLE_GENAI_USE_VERTEXAI=True
GOOGLE_CLOUD_PROJECT=your-project-id
GOOGLE_CLOUD_LOCATION=us-central1
GOOGLE_CLOUD_STAGING_BUCKET=your-staging-bucket-name

# Agent Configuration
AGENT_NAME="competitor_analysis_agent"
MODEL="gemini-2.5-flash"
MAX_ITERATIONS=3
```

---

## Phase 6: Testing & Verification

**Goal:** Test all functionality and verify complete setup

**🤖 AI Assistant will:**
- Start the complete application stack
- Execute test commands
- Verify agent functionality

**👤 User will:**
- Test authentication flow manually
- Verify UI functionality
- Check database records

### Step 6.1: Test Application Startup

**🤖 AI ASSISTANT TASK - Start complete application stack:**

Now that all components are configured, I'll start the complete application stack for the first time:

1. **Start Complete Development Stack**
```bash
npm run dev
```

💡 **Note:** `npm run dev` starts both services:
- **Web Application**: `http://localhost:3000`
- **Competitor Analysis Agent (ADK Service)**: `http://localhost:8000`

2. **👤 USER TASK - Verify Application Loads**
   - Open [http://localhost:3000](http://localhost:3000)
   - You should see landing page without errors
   - Check browser console for any errors

### Step 6.2: Test Authentication Flow

**👤 USER TASK - Test authentication manually:**

1. **Test User Registration**
   - Navigate to **Sign Up** page by clicking the "Get Started" button in the top right corner of the landing page
   - Create a test account with a real email
   - Check your email for confirmation link
   - Click on email verification button

2. **Test User Login**
   - You will be redirected to the **Login** page
   - Log in with your test credentials
   - You should be redirected to protected chat interface

3. **Verify Database User Creation**
   - Check Supabase sidebar → **Authentication** → Users
   - You should see your newly created user 
   - Navigate to **Table Editor** in the Supabase sidebar, and check the `users` table
   - You should see your test user record

### Step 6.3: Test Competitor Analysis Agent

**👤 USER TASK - Test agent functionality:**

1. **Test Agent Communication**
   - Navigate to the **Chat** page of the web app
   - Send a simple message like "Hello" or "Can you help me with competitor analysis?"
   - Verify the agent responds correctly
   - Check that the response comes from the competitor analysis agent

2. **Test Competitor Analysis Features**
   - Ask analysis questions like:
     - "Analyze the competitive landscape for electric vehicles"
     - "Who are the main competitors to Tesla?"
     - "What are the key features of successful SaaS companies?"
   - **Expected behavior:**
     - The agent should provide structured, intelligent analysis
     - Responses should demonstrate research and analysis capabilities
     - Check that responses are relevant and well-formatted

3. **Test Agent Context and Persistence**
   - Continue the conversation with follow-up questions
   - Verify the agent maintains context across messages
   - Test session continuity and conversation history

### Step 6.4: Test Chat Persistence

**👤 USER TASK - Test persistence features:**

1. **Test Conversation Saving**
   - Send several messages back and forth
   - Check Supabase **Table Editor** → `session_names` table
   - You should see session records

2. **Test Conversation History**
   - Navigate to **History** page
   - You should see your test conversation
   - Verify session titles are generated appropriately

3. **Verify ADK Tables**
   - Check additional ADK-created tables in Supabase:
     - `sessions` table: Should show ADK session data (auto-created by ADK)
     - `events` table: Should contain ADK event logs (auto-created by ADK)
     - `app_states` and `user_states` tables: Should contain ADK state management data

### Step 6.5: Test Database Records

**👤 USER TASK - Verify database functionality:**

1. **Check User Data**
   - In Supabase **Table Editor**, check the `users` table
   - Verify your user record was created correctly
   - Confirm email and profile information is accurate

2. **Check Session Data**
   - Look at the `session_names` table
   - Verify chat sessions are being recorded
   - Check that session titles are generated appropriately

### Phase 6 Completion Check
Setup is now complete! Verify all functionality:
- ✅ Application starts without errors
- ✅ Authentication flow works (signup, email confirmation, login)
- ✅ User records created in database
- ✅ Competitor analysis agent communication works
- ✅ Agent provides intelligent analysis responses
- ✅ Chat persistence and history works
- ✅ ADK session management functional
- ✅ Database records are properly created and tracked

---

## 6 · Troubleshooting Guide

### Common Issues and Solutions

#### Database Connection Issues

**Issue:** `connection to server at "xxx.supabase.co" failed`
**Solution:**

1. Verify DATABASE_URL format in `.env.local`
2. Check Supabase project is active and not paused
3. Verify database password is correct
4. Test connection from Supabase dashboard

#### Cloud Run Deployment Failures

**Issue:** Deployment fails or service doesn't start
**Solution:**

1. Check Cloud Run logs: `gcloud logs read --limit=50`
2. Verify all environment variables are set correctly
3. Check that billing is enabled on GCP project
4. Verify service account has correct permissions

#### Agent Communication Issues

**Issue:** Chat interface not receiving responses from competitor analysis agent
**Solution:**

1. Check that both web app and agent are running via `npm run dev` (complete stack)
2. Verify agent environment variables are properly configured
3. Check agent service logs for errors
4. Test agent connectivity through chat interface

#### Gemini API Errors

**Issue:** ADK chat responses fail or show API errors
**Solution:**

1. Verify Gemini API key is valid and active
2. Check API quota limits in Google AI Studio
3. Review Google Cloud Console for usage limits
4. Test API key directly with curl

#### Performance Issues

**Issue:** Slow agent responses or chat interface lag
**Solution:**

1. Verify Google Cloud/Vertex AI API quotas and limits
2. Check agent service performance and resource usage
3. Monitor Gemini API response times
4. Review chat interface optimization

### Getting Help

#### Database Debugging

**Check database state:**

```bash
# STEP 1: ALWAYS verify we're in apps/web directory
pwd
# Expected output: /path/to/project/apps/web

# STEP 2: Check migration status (ONLY from apps/web directory)
npm run db:status
```

**View database tables:**

- **🌐 Open browser:** Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
- **Select your project:** Choose your ADK Agent Simple project
- **Navigate to tables:** Click on **"Table Editor"** in the left sidebar
- **Browse data:** View tables and data directly in the Supabase interface

#### GCP Resource Status

**Verify GCP resources:**

```bash
gcloud services list --enabled  # Check enabled APIs
gcloud projects describe $(gcloud config get-value project)  # Check project status
gcloud auth list                 # Check authentication
```

---


---

## 7 · Cost Management

### Expected Monthly Costs (Development)

**Google Cloud Platform:**

- **Vertex AI API:** $0-10/month (depends on agent usage)
- **Other services:** $0-3/month (minimal for ADK agent services)

**Third-party Services:**

- **Supabase:** Free tier (up to 50MB database)
- **Google AI (Gemini):** Free tier available (generous quotas for development)

**Total Expected:** $3-15/month for development usage

### Cost Optimization Tips

1. **Monitor Vertex AI API usage** in GCP console
2. **Set up billing alerts** in GCP console
3. **Monitor Gemini API usage** in Google AI Studio
4. **Monitor agent usage patterns** to optimize API calls

### Production Scaling

When ready for production:

1. **Deploy web application** to your preferred hosting platform (Vercel, Netlify, etc.)
2. **Configure production agent deployment** (Cloud Run, Docker, etc.)
3. **Set up proper monitoring and alerting**
4. **Configure auto-scaling policies** for agent services
5. **Implement proper backup and disaster recovery**
5. **Switch to production environment variables** when ready

---

## 🎉 Congratulations!

You have successfully set up the complete ADK Agent Simple application!

**What you've accomplished:**

- ✅ Full-stack Agent application with Next.js frontend
- ✅ Python-based competitor analysis agent powered by Google's ADK
- ✅ Vertex AI integration for intelligent analysis capabilities
- ✅ AI-powered chat interface with agent-driven responses
- ✅ Secure authentication and user management
- ✅ Google Cloud Platform integration with Vertex AI
- ✅ Cost-effective development environment

**Your application now supports:**

- 🤖 Intelligent competitor analysis through ADK-powered agent
- 🔍 Advanced research capabilities powered by Google's Agent Development Kit
- 💬 AI-powered sessions with structured analysis responses
- 👥 Multi-user support with secure isolation
- 📈 Scalable ADK agent architecture for production use

**Next steps:**

1. **Customize the UI** to match your brand
2. **Enhance agent capabilities** with additional research tools
3. **Add more analysis features** like market insights, trend analysis
4. **Deploy to production** when ready
5. **Expand agent functionality** with specialized sub-agents, multi-modal analysis, etc.

**Need help?** Refer to the troubleshooting guide above or check the individual component documentation in the codebase.

Happy building! 🚀
