#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RELEASE_DIR="${ROOT_DIR}/release"
TAGS="webkit2_41"

PLATFORMS="${MAC_PLATFORMS:-darwin/arm64,darwin/amd64}"

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1"
    exit 1
  fi
}

mkdir -p "${RELEASE_DIR}"

require_cmd wails

IFS=',' read -r -a platforms <<< "${PLATFORMS}"
for platform in "${platforms[@]}"; do
  output_name="kebac-${platform//\//-}"
  echo "Building ${platform} -> ${output_name}"
  wails build -clean -platform "${platform}" -tags "${TAGS}" -o "${output_name}"
done

shopt -s nullglob
installers=( "${ROOT_DIR}/build/bin/"*.dmg "${ROOT_DIR}/build/bin/"*.app )
if [ "${#installers[@]}" -gt 0 ]; then
  cp -R "${installers[@]}" "${RELEASE_DIR}/"
else
  echo "No macOS installer artifacts found in build/bin."
fi

echo "Release artifacts are in ${RELEASE_DIR}"
