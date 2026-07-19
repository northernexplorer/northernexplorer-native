#!/bin/sh

# Sort Package.Json
yarn workspaces run sort-package-json

# Remove empty directories
find . -type d \( -name .git -o -name node_modules \) -prune -o -type d -empty -exec rmdir {} + 2>/dev/null

# Linting and Prettier
yarn prettier --write .
yarn eslint --fix
