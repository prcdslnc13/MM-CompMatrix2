#!/bin/sh
# Build, dual-tag, and export the Docker image.
# No host Node.js required — everything runs inside the container.
#
# Usage:
#   ./docker-build.sh              # build for native platform
#   ./docker-build.sh --export     # build + save tar
#   ./docker-build.sh --synology   # build for linux/amd64 (Synology deploy)
#   ./docker-build.sh --synology --export

set -e

IMAGE="mm-compmatrix"
VERSION=$(grep '"version"' package.json | head -1 | sed 's/.*"\([0-9][^"]*\)".*/\1/')

PLATFORM_FLAG=""
EXPORT=false

for arg in "$@"; do
  case "$arg" in
    --synology) PLATFORM_FLAG="--platform linux/amd64" ;;
    --export)   EXPORT=true ;;
  esac
done

echo "Building ${IMAGE}:${VERSION} + ${IMAGE}:latest ${PLATFORM_FLAG:+($PLATFORM_FLAG)}..."
docker build ${PLATFORM_FLAG} \
  -t "${IMAGE}:${VERSION}" \
  -t "${IMAGE}:latest" \
  .

echo "Build complete: ${IMAGE}:${VERSION}, ${IMAGE}:latest"

if [ "$EXPORT" = "true" ]; then
  echo "Exporting to ${IMAGE}.tar ..."
  docker save -o "${IMAGE}.tar" "${IMAGE}:${VERSION}" "${IMAGE}:latest"
  echo "Saved ${IMAGE}.tar ($(du -h "${IMAGE}.tar" | cut -f1))"
fi
