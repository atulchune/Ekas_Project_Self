#!/bin/sh
set -e

wait_for() {
    host="$1"
    port="$2"
    name="$3"
    echo "Waiting for $name at $host:$port..."
    until python -c "import socket; s = socket.create_connection(('$host', $port), timeout=2)" 2>/dev/null; do
        sleep 1
    done
    echo "$name is up."
}

if [ -n "$DB_HOST" ] && [ -n "$DB_PORT" ]; then
    wait_for "$DB_HOST" "$DB_PORT" "PostgreSQL"
fi

if [ -n "$REDIS_HOST" ] && [ -n "$REDIS_PORT" ]; then
    wait_for "$REDIS_HOST" "$REDIS_PORT" "Redis"
fi

exec "$@"
