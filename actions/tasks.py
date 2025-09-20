import os
import logging
from celery import shared_task
from typing import Dict

logger = logging.getLogger(__name__)


class TwilioClient:
    """Thin Twilio client abstraction used by send_alert_task.

    In production, replace the `send` method implementation with Twilio's SDK.
    For testing, we patch this class to assert calls.
    """

    def __init__(self):
        self.account_sid = os.getenv("TWILIO_ACCOUNT_SID", "")
        self.auth_token = os.getenv("TWILIO_AUTH_TOKEN", "")
        self.from_number = os.getenv("TWILIO_NUMBER", "")

    def send(self, user_id: str, message: str) -> None:
        """Send an alert message to a user via Twilio.

        Args:
            user_id: Recipient identifier (e.g., phone number in E.164).
            message: Message body to send.

        Raises:
            Exception: If sending fails for any reason.
        """
        # Placeholder: implement with Twilio SDK in real deployments.
        if not self.account_sid or not self.auth_token or not self.from_number:
            raise Exception("Twilio credentials are not configured")
        logger.info(f"[Twilio] Sending alert to {user_id}: {message}")
        # Simulate success; replace with SDK call.
        return None


class GupshupClient:
    """Thin Gupshup client abstraction used by send_alert_task.

    In production, replace the `send` method implementation with Gupshup's API.
    For testing, we patch this class to assert calls.
    """

    def __init__(self):
        self.api_key = os.getenv("GUPSHUP_API_KEY", "")

    def send(self, user_id: str, message: str) -> None:
        """Send an alert message to a user via Gupshup.

        Args:
            user_id: Recipient identifier (e.g., phone number).
            message: Message body to send.

        Raises:
            Exception: If sending fails for any reason.
        """
        if not self.api_key:
            raise Exception("Gupshup API key is not configured")
        logger.info(f"[Gupshup] Sending alert to {user_id}: {message}")
        return None


@shared_task(name="actions.send_alert_task")
def send_alert_task(user_id: str, message: str) -> Dict[str, str]:
    """Send an alert to a user with a primary provider and fallback.

    Attempts to send via Twilio first. If it fails, logs a warning and retries
    with Gupshup as a fallback. Raises the last exception if both providers
    fail.

    Args:
        user_id: Recipient identifier (e.g., phone number in E.164 format).
        message: The message body to send to the user.

    Returns:
        Dict[str, str]: A result payload containing at least a `status` key and
        the `provider` that handled the message. Example:
        `{"status": "sent", "provider": "twilio"}`.

    Raises:
        Exception: If both the primary and fallback providers fail to send the
        alert, the last encountered exception is raised.
    """
    primary = TwilioClient()
    try:
        primary.send(user_id=user_id, message=message)
        logger.info("Alert sent via Twilio")
        return {"status": "sent", "provider": "twilio"}
    except Exception as primary_err:
        logger.warning(f"Primary provider failed (Twilio). Falling back. Error: {primary_err}")
        fallback = GupshupClient()
        try:
            fallback.send(user_id=user_id, message=message)
            logger.info("Alert sent via Gupshup (fallback)")
            return {"status": "sent", "provider": "gupshup"}
        except Exception as fallback_err:
            logger.error(f"Fallback provider failed (Gupshup). Error: {fallback_err}")
            # Re-raise the fallback error to surface failure to caller
            raise fallback_err
