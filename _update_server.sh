#!/bin/bash
echo "Starting the update process..."

# Update the local repository with changes from the remote repository
git pull && \
echo "Local repository is updated."

# Build Server
cd server && \
npm run build && \
echo "Server is built."

# Check if the PM2 process is running
if pm2 show index > /dev/null; then
  # If the process is already running, restart it
  pm2 restart index --update-env && \
  echo "Server is restarted."
else
  # If the process is not running, start it
  pm2 start server/dist/index.js && \
  pm2 save && \
  echo "Server is started."
fi
