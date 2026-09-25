#!/bin/sh

ENV_FILE="./packages/server/.env"

if [ ! -f "$ENV_FILE" ]; then
    echo "ERROR: Environment file $ENV_FILE not found."
    exit 1
fi

# Helper function to extract key values from .env
get_env_val() {
    grep "^$1=" "$ENV_FILE" | head -n 1 | cut -d '=' -f 2- | sed -E 's/^"//;s/"$//;s/^\x27//;s/\x27$//'
}

# Load production parameters dynamically
PRODUCTION_DB_HOST=$(get_env_val "PRODUCTION_DB_HOST")
PRODUCTION_DB_PORT=$(get_env_val "PRODUCTION_DB_PORT")
PRODUCTION_DB_NAME=$(get_env_val "PRODUCTION_DB_NAME")
PRODUCTION_DB_USER=$(get_env_val "PRODUCTION_DB_USER")
PRODUCTION_DB_PASSWORD=$(get_env_val "PRODUCTION_DB_PASSWORD")

# Fallback defaults if optional params are missing
PRODUCTION_DB_HOST=${PRODUCTION_DB_HOST:-localhost}
PRODUCTION_DB_PORT=${PRODUCTION_DB_PORT:-15432}
PRODUCTION_DB_USER=${PRODUCTION_DB_USER:-postgres}

# Clean and create directory
rm -rf tmp/pg_dump
mkdir -p tmp/pg_dump

# Execute database dump using discrete flags
PGPASSWORD="$PRODUCTION_DB_PASSWORD" \
pg_dump -v -Fd -j 8 \
  -h "$PRODUCTION_DB_HOST" \
  -p "$PRODUCTION_DB_PORT" \
  -U "$PRODUCTION_DB_USER" \
  -d "$PRODUCTION_DB_NAME" \
  -f tmp/pg_dump

unset PGPASSWORD