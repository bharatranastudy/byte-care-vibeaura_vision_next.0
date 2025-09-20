param(
  [string]$PortRasa = "5005",
  [string]$PortActions = "5055",
  [string]$PortML = "8000"
)

function Test-Command {
  param([string]$Name)
  $old = $ErrorActionPreference
  $ErrorActionPreference = 'SilentlyContinue'
  $cmd = Get-Command $Name
  $ErrorActionPreference = $old
  return $null -ne $cmd
}

Write-Host "=== ByteCare: Starting full stack (ML, Actions, Rasa, ngrok) ===" -ForegroundColor Cyan

# 1) Ensure Python 3.10 x64 is available
if (-not (Test-Command 'py')) {
  Write-Host "Python launcher 'py' not found. Please install Python 3.10 and the py launcher from python.org." -ForegroundColor Red
  exit 1
}

$py10 = & py -3.10-64 -V 2>$null
if (-not $py10) {
  Write-Host "Python 3.10 x64 not found. Install with: winget install -e --id Python.Python.3.10 --architecture x64" -ForegroundColor Red
  exit 1
}
Write-Host "Found $py10" -ForegroundColor Green

# 2) Create / activate venv
$venv = ".venv_rasa"
if (-not (Test-Path $venv)) {
  Write-Host "Creating virtual environment at $venv ..." -ForegroundColor Yellow
  & py -3.10-64 -m venv $venv
  if ($LASTEXITCODE -ne 0) { Write-Host "Failed to create venv" -ForegroundColor Red; exit 1 }
}

$activate = Join-Path $venv "Scripts/Activate.ps1"
. $activate

# 3) Install dependencies
Write-Host "Upgrading pip/setuptools/wheel ..." -ForegroundColor Yellow
pip install -q -U pip setuptools wheel
if ($LASTEXITCODE -ne 0) { Write-Host "pip upgrade failed" -ForegroundColor Red; exit 1 }

Write-Host "Preinstalling binary scientific wheels (numpy/scipy/sklearn/matplotlib/SQLAlchemy/pydantic/protobuf) ..." -ForegroundColor Yellow
pip install -q --only-binary=:all: numpy==1.24.4 scipy==1.10.1 scikit-learn==1.1.3 matplotlib==3.5.3 SQLAlchemy==1.4.54 pydantic==1.10.9 protobuf==4.23.3
if ($LASTEXITCODE -ne 0) { Write-Host "Binary wheel preinstall failed" -ForegroundColor Red; exit 1 }

Write-Host "Installing Rasa 3.6.21 (stable for Python 3.10) ..." -ForegroundColor Yellow
pip install -q "rasa==3.6.21"
if ($LASTEXITCODE -ne 0) { Write-Host "Rasa install failed" -ForegroundColor Red; exit 1 }

Write-Host "Installing actions requirements ..." -ForegroundColor Yellow
pip install -q -r "rasa/actions/requirements.txt"
if ($LASTEXITCODE -ne 0) { Write-Host "Actions requirements install failed" -ForegroundColor Red; exit 1 }

# 4) Environment variables for the session
$env:ACTIONS_SERVER_URL = "http://localhost:$PortActions/webhook"
$env:ML_SERVICE_URL = "http://localhost:$PortML"

# 5) Start services in their own windows
Write-Host "Starting ML service on port $PortML ..." -ForegroundColor Green
Start-Process -FilePath "powershell" -ArgumentList "-NoExit","-Command",". $activate; python -m uvicorn ml.service:app --host 0.0.0.0 --port $PortML" -WindowStyle Minimized

Start-Sleep -Seconds 2

Write-Host "Starting Rasa actions on port $PortActions ..." -ForegroundColor Green
Start-Process -FilePath "powershell" -ArgumentList "-NoExit","-Command",". $activate; rasa run actions --port $PortActions" -WindowStyle Minimized

Start-Sleep -Seconds 2

Write-Host "Starting Rasa server on port $PortRasa ..." -ForegroundColor Green
Start-Process -FilePath "powershell" -ArgumentList "-NoExit","-Command",". $activate; $env:ACTIONS_SERVER_URL='http://localhost:$PortActions/webhook'; $env:ML_SERVICE_URL='http://localhost:$PortML'; rasa run --enable-api --cors '*' --port $PortRasa" -WindowStyle Minimized

# 6) Start ngrok if present
if (Test-Command 'ngrok') {
  Write-Host "Starting ngrok on port $PortRasa ..." -ForegroundColor Green
  Start-Process -FilePath "powershell" -ArgumentList "-NoExit","-Command","ngrok http $PortRasa" -WindowStyle Normal
  Write-Host "Remember to set your Twilio webhook to https://<your-ngrok-subdomain>.ngrok.io/webhooks/twilio/webhook" -ForegroundColor Yellow
} else {
  Write-Host "ngrok not found. Install with: winget install Ngrok.Ngrok, then run: ngrok config add-authtoken <TOKEN> and 'ngrok http $PortRasa'" -ForegroundColor Yellow
}

Write-Host "=== All processes launched. Keep all windows open while testing. ===" -ForegroundColor Cyan
