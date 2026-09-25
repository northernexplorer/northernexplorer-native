#!/bin/sh

LOCAL_POSTGRESQL_URL=$(grep '^POSTGRESQL_URL=' ./packages/server/.env | sed 's/^POSTGRESQL_URL=//')

# Extract components
LOCAL_USER=$(echo "$LOCAL_POSTGRESQL_URL" | sed -E 's#postgres://([^:]+):.*@.*#\1#')
LOCAL_PASSWORD=$(echo "$LOCAL_POSTGRESQL_URL" | sed -E 's#postgres://[^:]+:([^@]+)@.*#\1#')
LOCAL_HOST=$(echo "$LOCAL_POSTGRESQL_URL" | sed -E 's#.*@([^:/]+).*#\1#')
LOCAL_PORT=$(echo "$LOCAL_POSTGRESQL_URL" | sed -E 's#.*:([0-9]+)/.*#\1#')
LOCAL_DB=$(echo "$LOCAL_POSTGRESQL_URL" | sed -E 's#.*/([^?]+).*#\1#')

# Safety check: only allow localhost
if echo "$LOCAL_POSTGRESQL_URL" | grep -Eq '(@localhost|@127\.0\.0\.1|@::1)'; then
    echo "${GREEN}Local database detected. Safe to proceed.${NC}"
else
    echo "${RED}ERROR: The database URL does not point to localhost. Aborting.${NC}"
    exit 1
fi

# Ensure database exists
PGPASSWORD="$LOCAL_PASSWORD" \
psql "postgres://$LOCAL_USER:$LOCAL_PASSWORD@$LOCAL_HOST:$LOCAL_PORT/postgres" \
  -tc "SELECT 1 FROM pg_database WHERE datname='$LOCAL_DB'" | grep -q 1

if [ $? -ne 0 ]; then
    echo "Local database '$LOCAL_DB' does not exist. Creating it now..."
    PGPASSWORD="$LOCAL_PASSWORD" \
    createdb -h "$LOCAL_HOST" -p "$LOCAL_PORT" -U "$LOCAL_USER" "$LOCAL_DB" \
      || { echo "Failed to create local database '$LOCAL_DB'"; exit 1; }
fi

psql "$LOCAL_POSTGRESQL_URL" <<EOF
  DO \$\$ DECLARE
  r RECORD;
  BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
      EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
  END \$\$;
EOF

export PGPASSWORD="$LOCAL_PASSWORD"

pg_restore --clean --if-exists --no-owner \
  --no-privileges --no-tablespaces \
  -j 8 \
  -h "$LOCAL_HOST" -p "$LOCAL_PORT" -U "$LOCAL_USER" -d "$LOCAL_DB" \
  tmp/pg_dump 2>/dev/null

unset PGPASSWORD
