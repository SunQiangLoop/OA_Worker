#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"
LOG_DIR="$ROOT_DIR/logs"
PID_DIR="$ROOT_DIR/.pids"

BACKEND_HOST="127.0.0.1"
BACKEND_PORT="18080"
FRONTEND_HOST="127.0.0.1"
FRONTEND_PORT="44391"

mkdir -p "$LOG_DIR" "$PID_DIR"

# Load optional env files
if [ -f "$BACKEND_DIR/.env" ]; then
  set -a
  # shellcheck disable=SC1090
  . "$BACKEND_DIR/.env"
  set +a
fi

if [ -f "$FRONTEND_DIR/.env" ]; then
  set -a
  # shellcheck disable=SC1090
  . "$FRONTEND_DIR/.env"
  set +a
fi

# Start backend
if [ -f "$PID_DIR/backend.pid" ] && kill -0 "$(cat "$PID_DIR/backend.pid")" >/dev/null 2>&1; then
  echo "Backend already running (PID $(cat "$PID_DIR/backend.pid"))"
else
  echo "Starting backend on ${BACKEND_HOST}:${BACKEND_PORT}..."
  (
    cd "$BACKEND_DIR"
    SERVER_ADDR="${BACKEND_HOST}:${BACKEND_PORT}" \
    nohup go run ./cmd/server > "$LOG_DIR/backend.log" 2>&1 &
    echo $! > "$PID_DIR/backend.pid"
  )
  echo "Backend started (PID $(cat "$PID_DIR/backend.pid"))"
fi

# Start frontend
if [ -f "$PID_DIR/frontend.pid" ] && kill -0 "$(cat "$PID_DIR/frontend.pid")" >/dev/null 2>&1; then
  echo "Frontend already running (PID $(cat "$PID_DIR/frontend.pid"))"
else
  echo "Starting frontend on ${FRONTEND_HOST}:${FRONTEND_PORT}..."
  (
    cd "$FRONTEND_DIR"
    VITE_API_BASE_URL="http://${BACKEND_HOST}:${BACKEND_PORT}" \
    nohup npm run dev -- --host "$FRONTEND_HOST" --port "$FRONTEND_PORT" > "$LOG_DIR/frontend.log" 2>&1 &
    echo $! > "$PID_DIR/frontend.pid"
  )
  echo "Frontend started (PID $(cat "$PID_DIR/frontend.pid"))"
fi

echo "Done."
echo "Frontend: http://${FRONTEND_HOST}:${FRONTEND_PORT}"
echo "Backend:  http://${BACKEND_HOST}:${BACKEND_PORT}"
