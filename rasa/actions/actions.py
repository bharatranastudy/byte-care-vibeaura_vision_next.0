from __future__ import annotations

import datetime as dt
import io
import mimetypes
import os
from typing import Any, Dict, List, Text

import requests
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import ReminderScheduled, EventType


ML_SERVICE_URL = os.getenv("ML_SERVICE_URL", "http://localhost:8000")


class ActionImageAnalysis(Action):
    def name(self) -> Text:
        return "action_image_analysis"

    def run(
        self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]
    ) -> List[EventType]:
        # Try to extract media URLs passed by Twilio channel (if any)
        metadata = tracker.latest_message.get("metadata") or {}
        media_urls: List[str] = []

        # Common keys used by various channel payloads
        for key in ("media_urls", "image_urls", "attachments", "media"):
            val = metadata.get(key)
            if isinstance(val, list):
                media_urls.extend([str(v) for v in val])

        # Twilio may pass MediaUrl0, MediaUrl1,... style keys in metadata
        for k, v in (metadata.items() if isinstance(metadata, dict) else []):
            try:
                if str(k).lower().startswith("mediaurl") and isinstance(v, (str, bytes)):
                    media_urls.append(str(v))
            except Exception:
                pass

        # Fallback: look for a URL in the text
        text = (tracker.latest_message.get("text") or "").strip()
        if text.startswith("http"):
            media_urls.append(text)

        if not media_urls:
            dispatcher.utter_message(text="Please send an image (or a link to an image) to analyze.")
            return []

        # Take the first image
        image_url = media_urls[0]
        try:
            # Download image
            resp = requests.get(image_url, timeout=15)
            resp.raise_for_status()
            content = resp.content

            # Guess filename and content-type
            filename = os.path.basename(image_url.split("?")[0]) or "image.jpg"
            content_type, _ = mimetypes.guess_type(filename)
            if not content_type:
                content_type = "application/octet-stream"

            # Send to ML OCR endpoint as multipart
            ocr_url = f"{ML_SERVICE_URL}/ocr"
            files = {"file": (filename, io.BytesIO(content), content_type)}
            ocr_resp = requests.post(ocr_url, files=files, timeout=30)
            ocr_resp.raise_for_status()
            data = ocr_resp.json()
            text_out = data.get("text") or "(no text detected)"
            dispatcher.utter_message(text=f"OCR result:\n{text_out}")
        except Exception as e:
            dispatcher.utter_message(text=f"Sorry, I couldn't process the image. Error: {e}")

        return []


class ActionVaccinationSchedule(Action):
    def name(self) -> Text:
        return "action_vaccination_schedule"

    @staticmethod
    def build_schedule_for_age(age_years: float) -> List[str]:
        # Simplified example schedule (non-clinical). Replace with authoritative schedule per region if needed.
        s: List[str] = []
        if age_years < 1/12:
            s.append("At birth: BCG, Hepatitis B (1st dose), OPV-0")
        if age_years < 1:
            s.extend([
                "6, 10, 14 weeks: DTP, IPV/OPV, Hib, HepB",
                "9 months: Measles/MMR (1st dose)",
            ])
        if 1 <= age_years < 5:
            s.extend([
                "12-15 months: MMR (2nd dose)",
                "16-24 months: DTP booster, IPV/OPV booster",
            ])
        if 5 <= age_years < 12:
            s.append("5-6 years: DTP booster, OPV booster")
        if 10 <= age_years < 18:
            s.extend([
                "10-12 years: Tdap booster",
                "9-14 years: HPV (2 doses)",
            ])
        if 18 <= age_years < 60:
            s.extend([
                "Adults: Tdap once, then Td every 10 years",
                "Seasonal influenza: annually",
            ])
        if age_years >= 60:
            s.extend([
                "60+: Influenza annually, Pneumococcal (as per guidelines)",
            ])
        return s or ["Please consult your clinician for a personalized vaccination schedule."]

    def run(
        self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]
    ) -> List[EventType]:
        age_str = (tracker.get_slot("user_age") or "").strip()
        age_years: float
        try:
            # Accept plain years (e.g., "30") or with units like "6 months"
            if "month" in age_str:
                num = float("".join(ch for ch in age_str if (ch.isdigit() or ch == ".")))
                age_years = num / 12.0
            else:
                age_years = float("".join(ch for ch in age_str if (ch.isdigit() or ch == ".")))
        except Exception:
            age_years = 0.0

        schedule = self.build_schedule_for_age(age_years)
        schedule_text = "\n- " + "\n- ".join(schedule)
        dispatcher.utter_message(text=f"Recommended vaccination schedule based on your age:\n{schedule_text}")

        # Optionally schedule a follow-up reminder 24 hours later as an example
        reminder_time = dt.datetime.utcnow() + dt.timedelta(hours=24)
        return [
            ReminderScheduled(
                "action_send_vaccination_reminder",
                trigger_date_time=reminder_time,
                entities=tracker.latest_message.get("entities"),
                name=f"vaccination_reminder_{tracker.sender_id}",
                kill_on_user_message=False,
            )
        ]


class ActionSendVaccinationReminder(Action):
    def name(self) -> Text:
        return "action_send_vaccination_reminder"

    def run(
        self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]
    ) -> List[EventType]:
        dispatcher.utter_message(
            text=(
                "Reminder: Please review your vaccination schedule and consider scheduling pending doses. "
                "Reply with 'vaccination schedule' to view again."
            )
        )
        return []
