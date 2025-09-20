FROM python:3.10-slim

WORKDIR /app

# Install minimal system dependencies
# - build-essential/gcc: compile native wheels when needed
# - tesseract-ocr: required by pytesseract
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       gcc \
       build-essential \
       tesseract-ocr \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies (OpenCV is headless in requirements.txt)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

EXPOSE 8001

CMD ["uvicorn", "service:app", "--host", "0.0.0.0", "--port", "8001"]




