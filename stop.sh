#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PID_DIR="$ROOT_DIR/.pids"

stop_pid() {
  local name="$1"
  local pid_file="$PID_DIR/$2"

  if [ -f "$pid_file" ]; then
    local pid
    pid=$(cat "$pid_file")
    if kill -0 "$pid" >/dev/null 2>&1; then
      echo "Stopping $name (PID $pid)..."
      kill "$pid"
      rm -f "$pid_file"
    else
      echo "$name not running (stale PID $pid)."
      rm -f "$pid_file"
    fi
  else
    echo "$name PID file not found."
  fi
}

stop_pid "Backend" "backend.pid"
stop_pid "Frontend" "frontend.pid"

echo "Done."
