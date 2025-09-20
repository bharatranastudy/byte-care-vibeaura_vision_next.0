"""
Authentication and HMAC verification for government API integration
"""

import hmac
import hashlib
import json
from typing import Dict, Any
from config import settings

def verify_hmac_signature(payload: Dict[str, Any], signature: str) -> bool:
    """
    Verify HMAC signature for government outbreak alerts
    
    Args:
        payload: The request payload
        signature: The HMAC signature from the request header
    
    Returns:
        bool: True if signature is valid, False otherwise
    """
    try:
        # Create the message to sign
        message = json.dumps(payload, sort_keys=True, separators=(',', ':'))
        
        # Generate expected signature
        expected_signature = hmac.new(
            settings.hmac_secret_key.encode('utf-8'),
            message.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
        
        # Compare signatures
        return hmac.compare_digest(signature, expected_signature)
        
    except Exception as e:
        print(f"HMAC verification error: {str(e)}")
        return False

def generate_hmac_signature(payload: Dict[str, Any]) -> str:
    """
    Generate HMAC signature for outgoing requests
    
    Args:
        payload: The request payload
    
    Returns:
        str: The HMAC signature
    """
    message = json.dumps(payload, sort_keys=True, separators=(',', ':'))
    
    signature = hmac.new(
        settings.hmac_secret_key.encode('utf-8'),
        message.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    
    return signature

def verify_government_api_key(api_key: str, source: str) -> bool:
    """
    Verify API key for government sources
    
    Args:
        api_key: The API key to verify
        source: The source (MOFHW, IDSP, etc.)
    
    Returns:
        bool: True if API key is valid, False otherwise
    """
    valid_keys = {
        "mofhw": settings.mofhw_api_key,
        "idsp": settings.idsp_api_key
    }
    
    expected_key = valid_keys.get(source.lower())
    return expected_key and api_key == expected_key
