import os
from pathlib import Path
from dotenv import load_dotenv
from twilio.rest import Client

# --- ROBUST ENV LOADING ---
# 1. Get the folder where THIS file (voice_service.py) lives
current_file_dir = Path(__file__).resolve().parent

# 2. Try to find .env in the 'backend' folder
env_path = current_file_dir / ".env"

# 3. If not there, look in the parent (root) folder
if not env_path.exists():
    env_path = current_file_dir.parent / ".env"

# 4. Load it explicitly
load_dotenv(dotenv_path=env_path)

def send_alert(message_text):
    """
    Triggers a real phone call using Twilio credentials from .env.
    Includes pauses and repetition to ensure the message is heard 
    after the Trial Account 'Press any key' prompt.
    """
    # 1. Get credentials
    account_sid = os.getenv("TWILIO_ACCOUNT_SID")
    auth_token = os.getenv("TWILIO_AUTH_TOKEN")
    twilio_number = os.getenv("TWILIO_FROM_NUMBER")
    target_number = os.getenv("TO_PHONE_NUMBER")

    # 2. Check if credentials exist
    if not all([account_sid, auth_token, twilio_number, target_number]):
        print("❌ Error: Missing Twilio credentials in .env")
        return False

    try:
        # 3. Initialize Client
        client = Client(account_sid, auth_token)

        # 4. Construct TwiML (Voice Instructions)
        # We use voice="alice" for a slightly clearer voice.
        twiml_instruction = (
            f'<Response>'
            f'<Pause length="1"/>'
            f'<Say voice="alice">autosync System Alert. {message_text}</Say>'
            f'<Pause length="1"/>'
            f'<Say voice="alice">Repeating: {message_text}</Say>'
            f'</Response>'
        )

        # 5. Make the Call
        call = client.calls.create(
            twiml=twiml_instruction,
            to=target_number,
            from_=twilio_number
        )

        print(f"✅ Real Call Initiated! SID: {call.sid}")
        return True

    except Exception as e:
        print(f"❌ Twilio Error: {e}")
        return False