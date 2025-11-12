#!/usr/bin/env bash
set -euo pipefail

# Requirements:
# - ImageMagick 'convert' must be installed and available in PATH.
# - Source logo (non-transparent) at: design/logo-beta.png
#
# Generates:
# - assets/images/icon.png             (1024x1024)   square canvas, transparent bg
# - assets/images/adaptive-icon.png    (1024x1024)   transparent fg for Android adaptive icon
# - assets/images/splash-icon.png      (3000x3000)   white bg, centered, high-res
#
# Padding: 15% around content (≈70% content on canvas)

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC_LOGO="${ROOT_DIR}/design/logo-beta.png"
OUT_DIR="${ROOT_DIR}/assets/images"
ICON_PX=1024
ADAPTIVE_PX=1024
# Reduce splash canvas to lower APK size; still high-quality and best fit
SPLASH_PX=1600
PADDING_PERCENT=15

if ! command -v convert >/dev/null 2>&1; then
  echo "Error: ImageMagick 'convert' is required but not found in PATH."
  exit 1
fi

if [ ! -f "${SRC_LOGO}" ]; then
  echo "Error: Source logo not found at ${SRC_LOGO}"
  exit 1
fi

mkdir -p "${OUT_DIR}"

pad() {
  local input="$1"
  local output="$2"
  local size_px="$3"
  local bg="$4"          # 'none' for transparent or a color like 'white'

  # Compute content size as (100 - 2*PADDING)% of canvas (≈70% for 15% each side)
  local content_pct=$((100 - 2 * PADDING_PERCENT))

  # Resize to fit within content box while preserving aspect ratio
  # Center on a square canvas of target size with specified background
  convert \
    "${input}" \
    -resize "${content_pct}x${content_pct}%" \
    -gravity center \
    -background "${bg}" \
    -extent "${size_px}x${size_px}" \
    -strip \
    -define png:compression-level=9 \
    -define png:compression-strategy=1 \
    -define png:compression-filter=5 \
    "${output}"
}

echo "Generating icon (${ICON_PX}x${ICON_PX}) with transparent background..."
pad "${SRC_LOGO}" "${OUT_DIR}/icon.png" "${ICON_PX}" "none"

echo "Generating adaptive icon foreground (${ADAPTIVE_PX}x${ADAPTIVE_PX}) with transparent background..."
pad "${SRC_LOGO}" "${OUT_DIR}/adaptive-icon.png" "${ADAPTIVE_PX}" "none"

echo "Generating splash (${SPLASH_PX}x${SPLASH_PX}) with transparent background..."
pad "${SRC_LOGO}" "${OUT_DIR}/splash-icon.png" "${SPLASH_PX}" "none"

echo "Done. Outputs:"
ls -lh "${OUT_DIR}/icon.png" "${OUT_DIR}/adaptive-icon.png" "${OUT_DIR}/splash-icon.png"


