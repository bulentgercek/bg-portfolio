#!/bin/bash

echo "Starting the installation process..."

# Build Server and Client
cd client && \
npm install && \
echo "Client npm installation is completed."

cd ../server && \
npm install && \
echo "Server npm installation is completed."