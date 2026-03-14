#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PID_DIR="$ROOT_DIR/.pids"

stop_pid() {
  local name="$1"
  local pid_file="$PID_DIR/$2"
  local port="${3:-}"

  if [ -f "$pid_file" ]; then
    local pid
    pid=$(cat "$pid_file")
    if kill -0 "$pid" >/dev/null 2>&1; then
      echo "Stopping $name (PID $pid)..."
      kill "$pid"
    else
      echo "$name not running (stale PID $pid)."
    fi
    rm -f "$pid_file"
  else
    echo "$name PID file not found."
  fi

  # 兜底：清理仍持有端口的残留进程（如 go run 遗留的子进程）
  if [ -n "$port" ]; then
    local stale
    stale=$(lsof -ti:"$port" -sTCP:LISTEN 2>/dev/null || true)
    if [ -n "$stale" ]; then
      echo "Cleaning up stale process on port $port (PID $stale)..."
      kill "$stale" 2>/dev/null || true
    fi
  fi
}

stop_pid "Backend"  "backend.pid"  "18080"
stop_pid "Frontend" "frontend.pid" "44391"

echo "Done."
