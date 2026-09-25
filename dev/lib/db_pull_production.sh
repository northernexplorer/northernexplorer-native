#!/bin/sh
PRODUCTION_POSTGRESQL_URL=$(grep '^PRODUCTION_POSTGRESQL_URL=' ./packages/server/.env | sed 's/^PRODUCTION_POSTGRESQL_URL=//')
rm -rf tmp/pg_dump
mkdir -p tmp/pg_dump
pg_dump -v -Fd -j 8 "$PRODUCTION_POSTGRESQL_URL" -f tmp/pg_dump
