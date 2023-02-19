#!/bin/bash

# Change directory to the local repository folder
cd /home/bulentgercek/bg-portfolio

# Update the local repository with changes from the remote repository
git pull

# Build the server
cd server
npm run build
cd ..

# Restart the server using pm2
pm2 restart index