
"""
Instructions:
1. Twilio WhatsApp Sandbox Setup:
   - Sign up at https://www.twilio.com/whatsapp
   - Get your sandbox number and join code from the Twilio Console.
   - Send the join code via WhatsApp to the sandbox number to enable testing.
   - Set the webhook URL in the Twilio Console to your public endpoint (see ngrok below).

2. Expose Local Server with ngrok:
   - Install ngrok: https://ngrok.com/download
   - Run: ngrok http 8002
   - Copy the https URL from ngrok and set it as the webhook in Twilio Console.

3. Testing:
   - Send WhatsApp messages to your Twilio sandbox number from your WhatsApp app.
   - Try commands: schedule, symptoms fever cough, alert, services, etc.
"""




import os
from flask import Flask, request, session
from twilio.twiml.messaging_response import MessagingResponse
import openai
from collections import defaultdict



app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY", "supersecretkey")  # For session management

# --- Load Environment Variables ---

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
openai.api_key = OPENAI_API_KEY

# --- In-memory session store for WhatsApp numbers (for demo; use Redis/DB for production) ---
user_histories = defaultdict(list)


# --- Service Data ---
vaccination_dates = [
    "2025-10-01: Polio Booster 💉",
    "2025-11-15: Hepatitis B 💉",
    "2025-12-05: MMR (Measles, Mumps, Rubella) 💉"
]

symptom_map = {
    ("fever", "cough"): ("Possible flu 🤒"),
    ("rash",): ("Possible allergy 🤧"),
    ("headache", "nausea"): ("Possible migraine 🤕"),
    ("sore throat",): ("Possible throat infection 😷"),
    ("fatigue",): ("Possible anemia or tiredness 😴"),
}

services_list = """
Available commands:
- schedule: 📅 Show upcoming vaccination dates
- symptoms <your symptoms>: 🤒 Get a basic diagnosis
- alert: 🔔 Receive a sample vaccination reminder
- analyze <your question>: 🤖 Get advanced AI health analysis
- services: 🛠️ List all available commands
"""


# --- Helper Functions ---
def analyze_symptoms(text):
    text = text.lower()
    for keywords, diagnosis in symptom_map.items():
        if all(word in text for word in keywords):
            return diagnosis
    return "Sorry, I couldn't match your symptoms. Please consult a doctor. 🩺"

def chatgpt_analysis(user_query, user_id=None):
    if not OPENAI_API_KEY:
        return "OpenAI API key not set. Please contact admin."
    # Maintain conversation history for context
    history = user_histories[user_id] if user_id else []
    system_prompt = {
        "role": "system",
        "content": (
            "You are ByteCare, an advanced AI health assistant. "
            "You can answer health, wellness, and medical questions, provide empathetic support, and remember the user's previous context in this chat. "
            "Always be friendly, clear, and concise. If a question is outside your scope, recommend consulting a healthcare professional. "
            "If the user asks for a summary, provide a concise summary of the conversation so far."
        )
    }
    # Build message history for OpenAI
    messages = [system_prompt]
    for h in history[-6:]:  # last 6 exchanges for context
        messages.append({"role": "user", "content": h["user"]})
        if h.get("assistant"):
            messages.append({"role": "assistant", "content": h["assistant"]})
    messages.append({"role": "user", "content": user_query})
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo-16k",
            messages=messages,
            max_tokens=512,
            temperature=0.6
        )
        answer = response.choices[0].message["content"].strip()
        # Save to history
        if user_id:
            user_histories[user_id].append({"user": user_query, "assistant": answer})
        return answer
    except Exception as e:
        return f"AI analysis error: {str(e)}"


# --- Webhook Endpoint ---
@app.route("/twilio", methods=["POST"])
def twilio_webhook():
    incoming_msg = request.values.get("Body", "").strip()
    from_number = request.values.get("From", "")
    resp = MessagingResponse()
    reply = ""

    # Advanced: Use AI for all free-form queries, fallback to rules for known commands
    if incoming_msg.lower() == "schedule":
        reply = "Here are your upcoming vaccinations:\n" + "\n".join(vaccination_dates)
    elif incoming_msg.lower().startswith("symptoms"):
        symptoms_text = incoming_msg[8:].strip()
        diagnosis = analyze_symptoms(symptoms_text)
        reply = f"Diagnosis: {diagnosis}"
    elif incoming_msg.lower() == "alert":
        reply = "🔔 Reminder: Your next vaccination is on 2025-10-01 (Polio Booster). Don't forget!"
    elif incoming_msg.lower().startswith("analyze"):
        user_query = incoming_msg[7:].strip()
        if not user_query:
            reply = "Please provide a question or health concern after 'analyze'."
        else:
            reply = chatgpt_analysis(user_query, user_id=from_number)
    elif incoming_msg.lower() == "services":
        reply = services_list
    else:
        # For any other message, use advanced AI with context
        reply = chatgpt_analysis(incoming_msg, user_id=from_number)

    resp.message(reply)
    return str(resp)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8002)
