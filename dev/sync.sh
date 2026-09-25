#!/bin/sh

START_TIME=$(date +%s)

RED="\033[0;31m"
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
NC="\033[0m"

LOCAL_POSTGRESQL_URL="postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}"
PRODUCTION_POSTGRESQL_URL="postgresql://${PRODUCTION_DB_USER}:${PRODUCTION_DB_PASSWORD}@${PRODUCTION_DB_HOST}:${PRODUCTION_DB_PORT}/${PRODUCTION_DB_NAME}"

# Flags
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
            if [ $? -ne 0 ]; then
                echo "${RED}db_pull_production.sh failed. Aborting.${NC}"
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
