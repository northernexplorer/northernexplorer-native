#!/bin/sh

START_TIME=$(date +%s)

RED="\033[0;31m"
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
NC="\033[0m"

ENV_FILE="./apps/server/.env"

if [ ! -f "$ENV_FILE" ]; then
    echo "${RED}ERROR: Environment file $ENV_FILE not found.${NC}"
    exit 1
fi

get_env_val() {
    grep "^$1=" "$ENV_FILE" | head -n 1 | cut -d '=' -f 2- | sed -E 's/^"//;s/"$//;s/^\x27//;s/\x27$//'
}

DB_HOST=$(get_env_val "DB_HOST")
DB_PORT=$(get_env_val "DB_PORT")
DB_NAME=$(get_env_val "DB_NAME")
DB_USER=$(get_env_val "DB_USER")
DB_PASS=$(get_env_val "DB_PASS")

PRODUCTION_DB_HOST=$(get_env_val "PRODUCTION_DB_HOST")
PRODUCTION_DB_PORT=$(get_env_val "PRODUCTION_DB_PORT")
PRODUCTION_DB_NAME=$(get_env_val "PRODUCTION_DB_NAME")
PRODUCTION_DB_USER=$(get_env_val "PRODUCTION_DB_USER")
PRODUCTION_DB_PASSWORD=$(get_env_val "PRODUCTION_DB_PASSWORD")

DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_USER=${DB_USER:-postgres}

PRODUCTION_DB_HOST=${PRODUCTION_DB_HOST:-localhost}
PRODUCTION_DB_PORT=${PRODUCTION_DB_PORT:-15432}
PRODUCTION_DB_USER=${PRODUCTION_DB_USER:-postgres}

LOCAL_POSTGRESQL_URL="postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}"
PRODUCTION_POSTGRESQL_URL="postgresql://${PRODUCTION_DB_USER}:${PRODUCTION_DB_PASSWORD}@${PRODUCTION_DB_HOST}:${PRODUCTION_DB_PORT}/${PRODUCTION_DB_NAME}"

SKIP_PULL=0
SKIP_RESTORE=0

for arg in "$@"; do
    case "$arg" in
        --skip-pull) SKIP_PULL=1 ;;
        --skip-restore) SKIP_RESTORE=1 ;;
    esac
done

echo "${GREEN}This will sync the production DB with your local system.${NC}"

if [ "$SKIP_PULL" -eq 1 ]; then
    echo "${YELLOW}Skipping pull from production due to --skip flag.${NC}"
else
    echo ""
    echo "${YELLOW}Copying from: $PRODUCTION_POSTGRESQL_URL ${NC}"
    echo "${YELLOW}Copying to: $LOCAL_POSTGRESQL_URL ${NC}"
    echo ""

    echo "${GREEN}Do you want to proceed pulling from production? (y/n)${NC}"
    read answer
    case "$answer" in
        [Yy]* )
            echo "${GREEN}Starting pull from production...${NC}"
            ./dev/lib/db_pull_production.sh
            PULL_STATUS=$?
            if [ $PULL_STATUS -ne 0 ]; then
                echo "${RED}db_pull_production.sh failed with status $PULL_STATUS. Stopping sync workflow.${NC}"
                exit 1
            fi
            ;;
        [Nn]* )
            echo "${RED}Exiting without changes.${NC}"
            exit 0
            ;;
        * )
            echo "${RED}Invalid input. Exiting.${NC}"
            exit 1
            ;;
    esac
fi

# Guard check: Ensure dump directory exists and isn't empty before wiping local DB
if [ ! -d "tmp/pg_dump" ] || [ -z "$(ls -A tmp/pg_dump 2>/dev/null)" ]; then
    echo "${RED}ERROR: No valid database dump found in tmp/pg_dump. Aborting restore.${NC}"
    exit 1
fi

# Push to local (restore)
if [ "$SKIP_RESTORE" -eq 1 ]; then
    echo "${YELLOW}Skipping restore to local due to --skip-restore flag.${NC}"
else
    echo "${GREEN}Starting push to local...${NC}"
    ./dev/lib/db_push_localhost.sh
    if [ $? -ne 0 ]; then
        echo "${RED}db_push_localhost.sh failed.${NC}"
        exit 1
    fi
fi

END_TIME=$(date +%s)
ELAPSED=$((END_TIME - START_TIME))
echo "${GREEN}Sync complete.${NC}"
echo "Finished in ${ELAPSED} seconds."