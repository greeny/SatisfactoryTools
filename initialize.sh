#!/bin/bash

# installs all required dependencies to build on linux

# install curl (used to fetch later commands)
sudo apt install curl

curl -sL https://deb.nodesource.com/setup_16.x | sudo bash

# install nodejs
sudo apt install -y nodejs

# make sure the GPG key for yarn is trusted
curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor | sudo tee /usr/share/keyrings/yarnkey.gpg >/dev/null
echo "deb [signed-by=/usr/share/keyrings/yarnkey.gpg] https://dl.yarnpkg.com/debian stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

# install yarn (apt update first to use the GPG key we just added)
sudo apt update && sudo apt install yarn

# install dependencies for umodel
sudo apt install libsdl2-2.0-0

# mark umodel executable
chmod +x ./bin/umodel/linux/umodel

# initialize yarn
yarn install