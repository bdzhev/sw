#!/bin/sh
set -e

ENV_FILE=".env"
EXAMPLE_FILE=".env.example"

if [ ! -f "$EXAMPLE_FILE" ]; then
  echo "Error: $EXAMPLE_FILE not found"
  exit 1
fi

if [ -f "$ENV_FILE" ]; then
  # Check if JWT_SECRET is already set
  if grep -q "^JWT_SECRET=.\+" "$ENV_FILE"; then
    echo ".env already has JWT_SECRET — nothing to do."
    exit 0
  fi
fi

SECRET=$(openssl rand -hex 32)

if [ ! -f "$ENV_FILE" ]; then
  sed "s/^JWT_SECRET=.*/JWT_SECRET=$SECRET/" "$EXAMPLE_FILE" > "$ENV_FILE"
  echo "Created .env with a generated JWT_SECRET."
  echo "Open .env and fill in POSTGRES_USER, POSTGRES_PASSWORD, and DATABASE_URL."
else
  if grep -q "^JWT_SECRET=" "$ENV_FILE"; then
    sed -i.bak "s/^JWT_SECRET=.*/JWT_SECRET=$SECRET/" "$ENV_FILE" && rm "$ENV_FILE.bak"
  else
    echo "\nJWT_SECRET=$SECRET" >> "$ENV_FILE"
  fi
  echo "Generated and added JWT_SECRET to existing .env."
fi
