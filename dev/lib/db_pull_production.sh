#!/bin/sh

ENV_FILE="./apps/server/.env"

if [ ! -f "$ENV_FILE" ]; then
    echo "ERROR: Environment file $ENV_FILE not found."
    exit 1
fi

get_env_val() {
    grep "^$1=" "$ENV_FILE" | head -n 1 | cut -d '=' -f 2- | sed -E 's/^"//;s/"$//;s/^\x27//;s/\x27$//'
}

PRODUCTION_DB_HOST=$(get_env_val "PRODUCTION_DB_HOST")
PRODUCTION_DB_PORT=$(get_env_val "PRODUCTION_DB_PORT")
PRODUCTION_DB_NAME=$(get_env_val "PRODUCTION_DB_NAME")
PRODUCTION_DB_USER=$(get_env_val "PRODUCTION_DB_USER")
PRODUCTION_DB_PASSWORD=$(get_env_val "PRODUCTION_DB_PASSWORD")

PRODUCTION_DB_HOST=${PRODUCTION_DB_HOST:-localhost}
PRODUCTION_DB_PORT=${PRODUCTION_DB_PORT:-15432}
PRODUCTION_DB_USER=${PRODUCTION_DB_USER:-postgres}

rm -rf tmp/pg_dump
mkdir -p tmp/pg_dump

PGPASSWORD="$PRODUCTION_DB_PASSWORD" \
pg_dump -v -Fd -j 8 \
  -h "$PRODUCTION_DB_HOST" \
  -p "$PRODUCTION_DB_PORT" \
  -U "$PRODUCTION_DB_USER" \
  -d "$PRODUCTION_DB_NAME" \
  -f tmp/pg_dump

# Catch pg_dump failure explicitly
if [ $? -ne 0 ]; then
    echo "\033[0;31mERROR: pg_dump failed to connect or export data. Aborting pull.\033[0m"
    rm -rf tmp/pg_dump
    exit 1
fi

unset PGPASSWORD