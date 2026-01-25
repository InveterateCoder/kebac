#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RELEASE_DIR="${ROOT_DIR}/release"
TAGS="webkit2_41"

PLATFORM="${WINDOWS_PLATFORM:-windows/amd64}"
OUTPUT_NAME="kebac-${PLATFORM//\//-}"

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1"
    exit 1
  fi
}

mkdir -p "${RELEASE_DIR}"

require_cmd wails
require_cmd makensis

echo "Building ${PLATFORM} -> ${OUTPUT_NAME}"
wails build -clean -platform "${PLATFORM}" -tags "${TAGS}" -o "${OUTPUT_NAME}" -nsis

shopt -s nullglob
installers=( "${ROOT_DIR}/build/bin/"*installer*.exe "${ROOT_DIR}/build/bin/"*.msi )
if [ "${#installers[@]}" -gt 0 ]; then
  cp -R "${installers[@]}" "${RELEASE_DIR}/"
else
  echo "No Windows installer artifacts found in build/bin."
fi

echo "Release artifacts are in ${RELEASE_DIR}"
