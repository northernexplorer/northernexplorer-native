#!/bin/sh

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

# Add current user to docker group
sudo usermod -aG docker "$(id -un)"

# Yakuake
sudo apt install -y yakuake qdbus-qt5