#!/usr/bin/env bash
# Start the OptiShift backend server
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if [ ! -d "venv" ]; then
  echo "📦 Creating virtual environment..."
  python3 -m venv venv
  venv/bin/pip install -r requirements.txt -q
fi

echo "🚀 Starting OptiShift API on http://localhost:8000"
echo "   Docs: http://localhost:8000/docs"
echo "   Health: http://localhost:8000/health"

venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
