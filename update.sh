#!/bin/bash

# Update the local repository with changes from the remote repository
git pull

# Build Server and Client
npm run build

# Check if the PM2 process is running
if pm2 show index > /dev/null; then
  # If the process is already running, restart it
  pm2 restart index
else
  # If the process is not running, start it
  pm2 start server/dist/index.js
  pm2 save
fi
