#!/bin/sh

# Ensure script runs relative to the project root directory where .nvmrc lives
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT" || exit 1

# Pre-install
sudo apt update

# Codegen
sudo apt install -y dos2unix

# Docker
sudo apt install -y curl
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh ./get-docker.sh
rm -f get-docker.sh
sudo usermod -aG docker "$(id -un)"

# Yakuake
sudo apt install -y yakuake qdbus-qt5

# NVM (Node Version Manager)
export NVM_DIR="$HOME/.nvm"

# Install NVM if not already installed
if [ ! -d "$NVM_DIR" ]; then
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
fi

# Load NVM into the current execution environment
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# Install, activate, and set default Node version specified in .nvmrc
if [ -f ".nvmrc" ]; then
    NVMRC_VERSION=$(cat .nvmrc | tr -d '[:space:]')
    echo "Installing Node version from .nvmrc ($NVMRC_VERSION)..."
    nvm install
    nvm use
    nvm alias default "$NVMRC_VERSION"
    echo "Set Node $NVMRC_VERSION as the default NVM version."
else
    echo "Error: .nvmrc not found at $PROJECT_ROOT/.nvmrc"
    exit 1
fi

# Enable Corepack and prepare Yarn
echo "Enabling Corepack and setting up Yarn..."
corepack enable
corepack prepare yarn@stable --activate