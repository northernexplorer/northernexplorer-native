#!/bin/sh

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

ENV_FILE="./apps/server/.env"

if [ ! -f "$ENV_FILE" ]; then
    echo "${RED}ERROR: Environment file $ENV_FILE not found.${NC}"
    exit 1
fi

# Helper function to extract key values from .env
get_env_val() {
    grep "^$1=" "$ENV_FILE" | head -n 1 | cut -d '=' -f 2- | sed -E 's/^"//;s/"$//;s/^\x27//;s/\x27$//'
}

# Load parameters dynamically from .env
LOCAL_HOST=$(get_env_val "DB_HOST")
LOCAL_PORT=$(get_env_val "DB_PORT")
LOCAL_DB=$(get_env_val "DB_NAME")
LOCAL_USER=$(get_env_val "DB_USER")
LOCAL_PASSWORD=$(get_env_val "DB_PASS")

# Fallback defaults if optional params are missing in .env
LOCAL_HOST=${LOCAL_HOST:-localhost}
LOCAL_PORT=${LOCAL_PORT:-5432}
LOCAL_USER=${LOCAL_USER:-postgres}

# Construct connection URL dynamically
LOCAL_POSTGRESQL_URL="postgresql://${LOCAL_USER}:${LOCAL_PASSWORD}@${LOCAL_HOST}:${LOCAL_PORT}/${LOCAL_DB}"

# Safety check: only allow localhost
if [ "$LOCAL_HOST" = "localhost" ] || [ "$LOCAL_HOST" = "127.0.0.1" ] || [ "$LOCAL_HOST" = "::1" ]; then
    echo "${GREEN}Local database detected ($LOCAL_HOST). Safe to proceed.${NC}"
else
    echo "${RED}ERROR: DB_HOST is set to '$LOCAL_HOST'. Script restricted to localhost. Aborting.${NC}"
    exit 1
fi

# Ensure target database exists
PGPASSWORD="$LOCAL_PASSWORD" \
psql -h "$LOCAL_HOST" -p "$LOCAL_PORT" -U "$LOCAL_USER" -d postgres \
  -tc "SELECT 1 FROM pg_database WHERE datname='$LOCAL_DB'" | grep -q 1

if [ $? -ne 0 ]; then
    echo "Local database '$LOCAL_DB' does not exist. Creating it now..."
    PGPASSWORD="$LOCAL_PASSWORD" \
    createdb -h "$LOCAL_HOST" -p "$LOCAL_PORT" -U "$LOCAL_USER" "$LOCAL_DB" \
      || { echo "${RED}Failed to create local database '$LOCAL_DB'${NC}"; exit 1; }
fi

# Drop existing tables
PGPASSWORD="$LOCAL_PASSWORD" \
psql "$LOCAL_POSTGRESQL_URL" <<EOF
  DO \$\$ DECLARE
  r RECORD;
  BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
      EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
  END \$\$;
EOF

# Restore database dump
PGPASSWORD="$LOCAL_PASSWORD" \
pg_restore --clean --if-exists --no-owner \
  --no-privileges --no-tablespaces \
  -j 8 \
  -h "$LOCAL_HOST" -p "$LOCAL_PORT" -U "$LOCAL_USER" -d "$LOCAL_DB" \
  tmp/pg_dump 2>/dev/null

unset PGPASSWORD