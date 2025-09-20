import pytest
from unittest.mock import patch, MagicMock

import actions.tasks as tasks_mod


def test_send_alert_task_primary_success():
    user_id = "+1234567890"
    message = "Test alert message"

    with patch.object(tasks_mod, "TwilioClient") as twilio_cls, \
         patch.object(tasks_mod, "GupshupClient") as gupshup_cls:
        # Configure primary (Twilio) to succeed
        twilio_instance = MagicMock()
        twilio_cls.return_value = twilio_instance
        twilio_instance.send.return_value = None

        # Fallback should not be used
        gupshup_instance = MagicMock()
        gupshup_cls.return_value = gupshup_instance

        result = tasks_mod.send_alert_task(user_id, message)

        twilio_instance.send.assert_called_once_with(user_id=user_id, message=message)
        gupshup_instance.send.assert_not_called()
        assert result == {"status": "sent", "provider": "twilio"}


def test_send_alert_task_fallback_on_primary_failure():
    user_id = "+1234567890"
    message = "Test alert message"

    with patch.object(tasks_mod, "TwilioClient") as twilio_cls, \
         patch.object(tasks_mod, "GupshupClient") as gupshup_cls:
        # Primary fails
        twilio_instance = MagicMock()
        twilio_cls.return_value = twilio_instance
        twilio_instance.send.side_effect = Exception("Twilio down")

        # Fallback succeeds
        gupshup_instance = MagicMock()
        gupshup_cls.return_value = gupshup_instance
        gupshup_instance.send.return_value = None

        result = tasks_mod.send_alert_task(user_id, message)

        twilio_instance.send.assert_called_once_with(user_id=user_id, message=message)
        gupshup_instance.send.assert_called_once_with(user_id=user_id, message=message)
        assert result == {"status": "sent", "provider": "gupshup"}


def test_send_alert_task_both_fail_raises():
    user_id = "+1234567890"
    message = "Test alert message"

    with patch.object(tasks_mod, "TwilioClient") as twilio_cls, \
         patch.object(tasks_mod, "GupshupClient") as gupshup_cls:
        # Primary fails
        twilio_instance = MagicMock()
        twilio_cls.return_value = twilio_instance
        twilio_instance.send.side_effect = Exception("Twilio down")

        # Fallback also fails
        gupshup_instance = MagicMock()
        gupshup_cls.return_value = gupshup_instance
        gupshup_instance.send.side_effect = Exception("Gupshup down")

        with pytest.raises(Exception):
            tasks_mod.send_alert_task(user_id, message)

        twilio_instance.send.assert_called_once_with(user_id=user_id, message=message)
        gupshup_instance.send.assert_called_once_with(user_id=user_id, message=message)
