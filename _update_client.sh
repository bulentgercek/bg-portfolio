#!/bin/bash
echo "Starting the client update process..."

# Build Client
cd client
npm run build && echo "Client is built."

# Copy the client files to the Nginx directory
sudo rm -rf var/www/bulentgercek.com/client/* && \
sudo cp -r /home/bulentgercek/bg-portfolio/client/dist /var/www/bulentgercek.com/client/ && \
echo "Client files are copied to the Nginx directory."

# Restart Nginx
sudo systemctl restart nginx && \
echo "Nginx is restarted."