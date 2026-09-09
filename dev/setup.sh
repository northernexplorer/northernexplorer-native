#!/bin/sh

# Ensure script runs relative to the project root directory where .nvmrc lives
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT" || exit 1

# Pre-install
sudo apt update

# Codegen
sudo apt install -y dos2unix

# Docker (Manual Repository Setup to Bypass Distro Detection Issues)
sudo apt install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Resolve Debian codename or default to bookworm if custom/unrecognized
DEBIAN_CODENAME=$(. /etc/os-release && echo "$VERSION_CODENAME")
if [ -z "$DEBIAN_CODENAME" ]; then
    DEBIAN_CODENAME="bookworm"
fi

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian \
  $DEBIAN_CODENAME stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
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