#!/bin/sh

# Sort Package.Json
yarn workspaces run sort-package-json

# Linting and Prettier
yarn eslint --fix
yarn prettier --write .