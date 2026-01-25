#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RELEASE_DIR="${ROOT_DIR}/release"
TAGS="webkit2_41"

PLATFORM="${LINUX_PLATFORM:-linux/amd64}"
OUTPUT_NAME="kebac-${PLATFORM//\//-}"

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1"
    exit 1
  fi
}

mkdir -p "${RELEASE_DIR}"

require_cmd wails
require_cmd nfpm

echo "Building ${PLATFORM} -> ${OUTPUT_NAME}"
wails build -clean -platform "${PLATFORM}" -tags "${TAGS}" -o "${OUTPUT_NAME}"

if [ "${PLATFORM}" = "linux/amd64" ]; then
  echo "Packaging .deb/.rpm from ${OUTPUT_NAME}..."
  cp "${ROOT_DIR}/build/bin/${OUTPUT_NAME}" "${ROOT_DIR}/build/bin/kebac"
  pushd "${ROOT_DIR}" >/dev/null
  nfpm pkg -f build/linux/nfpm.yaml -p deb
  nfpm pkg -f build/linux/nfpm.yaml -p rpm
  shopt -s nullglob
  mv "${ROOT_DIR}"/*.deb "${ROOT_DIR}"/*.rpm "${RELEASE_DIR}/" || true
  popd >/dev/null
else
  echo "Skipping .deb/.rpm: nfpm.yaml expects linux/amd64 binary."
fi

echo "Release artifacts are in ${RELEASE_DIR}"
