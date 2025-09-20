"""
LanguageService: detect and translate user messages for multilingual support.
Uses langdetect for detection and optionally googletrans for translation.
"""
from typing import Optional, Dict
import logging

try:
    from langdetect import detect  # type: ignore
except Exception:  # pragma: no cover
    detect = None  # runtime fallback

try:
    from googletrans import Translator  # type: ignore
except Exception:  # pragma: no cover
    Translator = None  # runtime fallback

logger = logging.getLogger(__name__)

SUPPORTED_LANGS = {
    "en": "English",
    "hi": "Hindi",
    "mr": "Marathi",
    "bn": "Bengali",
    "ta": "Tamil",
    "te": "Telugu",
}

class LanguageService:
    def __init__(self):
        self.translator = Translator() if Translator else None

    async def detect_language(self, text: str) -> Dict[str, str]:
        if not text:
            return {"code": "en", "name": SUPPORTED_LANGS["en"]}
        code = "en"
        try:
            if detect:
                code = detect(text)
        except Exception as e:
            logger.warning(f"Language detection failed, defaulting to 'en': {e}")
            code = "en"
        # normalize to supported set
        if code not in SUPPORTED_LANGS:
            # fallback family mapping
            if code.startswith("en"):
                code = "en"
            elif code.startswith("hi"):
                code = "hi"
            elif code.startswith("mr"):
                code = "mr"
            elif code.startswith("bn"):
                code = "bn"
            elif code.startswith("ta"):
                code = "ta"
            elif code.startswith("te"):
                code = "te"
            else:
                code = "en"
        return {"code": code, "name": SUPPORTED_LANGS.get(code, "English")}

    async def translate_to(self, text: str, target_code: str) -> Dict[str, Optional[str]]:
        if not text:
            return {"text": text, "provider": None}
        if not self.translator:
            return {"text": text, "provider": None}
        try:
            res = self.translator.translate(text, dest=target_code)
            return {"text": res.text, "provider": "googletrans"}
        except Exception as e:
            logger.warning(f"Translation failed, returning original text: {e}")
            return {"text": text, "provider": None}

    async def normalize_user_text(self, text: str) -> Dict[str, str]:
        """Detect language and, if not English, translate to English for NLU.
        Returns a dict with original text, detected code, and text_en (possibly translated).
        """
        det = await self.detect_language(text)
        code = det["code"]
        if code == "en":
            return {"text": text, "detected": code, "text_en": text}
        tr = await self.translate_to(text, "en")
        return {"text": text, "detected": code, "text_en": tr.get("text") or text}
