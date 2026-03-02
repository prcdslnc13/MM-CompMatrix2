#!/bin/sh
# Generate env.js from environment variables at container start
cat > /usr/share/nginx/html/env.js <<EOF
window.__ENV__ = {
  ADMIN_PASSWORD: "${ADMIN_PASSWORD:-changeme}"
};
EOF

exec "$@"
