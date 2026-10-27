#!/bin/bash
cd "$(dirname "$0")"
if ! command -v npm >/dev/null 2>&1; then
  echo "Node.js and npm are required. Install the current LTS version from https://nodejs.org/ and run this file again."
  read -r -p "Press Return to close..."
  exit 1
fi
if [ ! -d node_modules ]; then
  npm install || { echo "Dependency installation failed. Check your internet connection."; read -r -p "Press Return to close..."; exit 1; }
fi
npm run dev
