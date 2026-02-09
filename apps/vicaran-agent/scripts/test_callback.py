import json
import os
import urllib.error
import urllib.request
import uuid


def load_env_local(filepath):
    """Simple parser for .env.local"""
    try:
        with open(filepath) as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#"):
                    continue
                if "=" in line:
                    key, value = line.split("=", 1)
                    key = key.strip()
                    value = value.strip().strip('"').strip("'")
                    os.environ[key] = value
    except FileNotFoundError:
        print(f"⚠️ Warning: {filepath} not found, using defaults.")


def test_callback():
    print("🚀 Starting Callback API Test (urllib version)...")

    # Load env
    load_env_local(".env.local")

    # Configuration
    api_url = os.getenv("CALLBACK_API_URL", "http://localhost:3000/api/agent-callback")
    api_secret = os.getenv(
        "AGENT_SECRET", "scryb_agent_2026_a7f3e9c1b5d8k2m4n6p8q0r3s5t7u9w1x3y5z7"
    )

    print(f"🎯 Target URL: {api_url}")

    # Generate a random investigation ID
    investigation_id = str(uuid.uuid4())
    print(f"🆔 Generated Investigation ID: {investigation_id}")

    # Payload
    payload = {
        "type": "INVESTIGATION_STARTED",
        "investigation_id": investigation_id,
        "data": {},
    }

    headers = {"Content-Type": "application/json", "X-Agent-Secret": api_secret}

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(api_url, data=data, headers=headers, method="POST")

    try:
        print("📡 Sending request...")
        with urllib.request.urlopen(req) as response:
            body = response.read().decode("utf-8")
            print(f"\n✅ Status Code: {response.getcode()}")
            print(f"📄 Response Text: {body}")

    except urllib.error.HTTPError as e:
        print(f"\n⚠️ HTTP Error: {e.code} {e.reason}")
        body = e.read().decode("utf-8")
        print(f"📄 Error Body: {body}")

        if e.code == 404:
            print("\n⚠️ ANALYSIS: 404 received.")
            if "Investigation not found" in body:
                print(
                    "👉 CAUSE CONFIRMED: The logic rejected the ID because it doesn't exist in the DB."
                )
            else:
                print(
                    "👉 CAUSE: The endpoint itself was not found (Router/Network issue)."
                )

    except Exception as e:
        print(f"\n❌ Error: {str(e)}")


if __name__ == "__main__":
    test_callback()
