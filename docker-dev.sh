#!/bin/sh
# Run the Vite dev server inside a Docker container.
# No host Node.js required — mounts source and serves with hot-reload.
#
# Usage:
#   ./docker-dev.sh                           # default password "changeme"
#   ADMIN_PASSWORD=secret ./docker-dev.sh     # custom password
#
# Dev server available at http://localhost:5173

set -e

ADMIN_PASSWORD="${ADMIN_PASSWORD:-changeme}"

echo "Starting dev server at http://localhost:5173 ..."
echo "Admin password: ${ADMIN_PASSWORD}"
echo "Press Ctrl+C to stop."

docker run --rm -it \
  -v "$(pwd):/app" \
  -w /app \
  -p 5173:5173 \
  -e "VITE_ADMIN_PASSWORD=${ADMIN_PASSWORD}" \
  node:20-alpine \
  sh -c "npm install && npx vite --host 0.0.0.0"
