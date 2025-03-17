#!/bin/bash

# Check if .env exists, otherwise create it
if [ ! -f .env ]; then
  touch .env
fi

# Generate a new secure JWT_SECRET and remove newlines
NEW_SECRET=$(openssl rand -base64 64 | tr -d '\n')

# Check if JWT_SECRET exists, then replace it, else append it
if grep -q "JWT_SECRET=" .env; then
  # Replace existing JWT_SECRET safely
  sed -i '' "s|JWT_SECRET=.*|JWT_SECRET=\"$NEW_SECRET\"|" .env
  echo "✅ JWT_SECRET updated in .env"
else
  # Append if not found
  echo "JWT_SECRET=\"$NEW_SECRET\"" >> .env
  echo "✅ JWT_SECRET added to .env"
fi
