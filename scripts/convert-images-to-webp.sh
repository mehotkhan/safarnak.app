#!/usr/bin/env bash
set -euo pipefail

# Requirements:
# - ImageMagick 'convert' must be installed and available in PATH.
# - cwebp (from WebP tools) for optimal WebP conversion (optional, falls back to ImageMagick)
#
# Converts all PNG and JPG images in assets/images/ to WebP format
# for smaller APK size. Maintains quality while significantly reducing file size.

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
IMAGES_DIR="${ROOT_DIR}/assets/images"

# Check for required tools
if ! command -v convert >/dev/null 2>&1; then
  echo "Error: ImageMagick 'convert' is required but not found in PATH."
  exit 1
fi

# Use cwebp if available (better quality/size ratio than ImageMagick)
USE_CWEBP=false
if command -v cwebp >/dev/null 2>&1; then
  USE_CWEBP=true
  echo "✅ Using cwebp for optimal WebP conversion"
else
  echo "ℹ️  cwebp not found, using ImageMagick (install WebP tools for better results)"
fi

if [ ! -d "${IMAGES_DIR}" ]; then
  echo "Error: Images directory not found at ${IMAGES_DIR}"
  exit 1
fi

echo "🔄 Converting images to WebP format..."
echo "📁 Processing directory: ${IMAGES_DIR}"

# Function to convert image to WebP
convert_to_webp() {
  local input="$1"
  local output="${input%.*}.webp"

  echo "  📸 Converting: $(basename "$input") → $(basename "$output")"

  if [ "$USE_CWEBP" = true ]; then
    # Use cwebp for better quality/size ratio
    # -q 85: Good quality with significant size reduction
    # -m 6: Maximum compression effort (slower but smaller)
    cwebp -q 85 -m 6 "$input" -o "$output" 2>/dev/null || {
      echo "  ⚠️  cwebp failed, falling back to ImageMagick"
      convert "$input" -quality 85 -define webp:lossless=false "$output"
    }
  else
    # Fallback to ImageMagick convert
    convert "$input" -quality 85 -define webp:lossless=false "$output"
  fi

  # Show size comparison
  local original_size=$(stat -f%z "$input" 2>/dev/null || stat -c%s "$input" 2>/dev/null || echo "0")
  local webp_size=$(stat -f%z "$output" 2>/dev/null || stat -c%s "$output" 2>/dev/null || echo "0")
  local savings=$((original_size - webp_size))
  local savings_pct="0"
  if [ "$original_size" -gt 0 ]; then
    savings_pct=$((savings * 100 / original_size))
  fi

  echo "     📊 $(basename "$input"): $(numfmt --to=iec-i --suffix=B "$original_size") → $(numfmt --to=iec-i --suffix=B "$webp_size") (${savings_pct}% smaller)"
}

# Convert all PNG and JPG files
converted_count=0
total_savings=0

while IFS= read -r -d '' file; do
  # Skip if WebP version already exists and is newer than source
  webp_file="${file%.*}.webp"
  if [ -f "$webp_file" ] && [ "$webp_file" -nt "$file" ]; then
    echo "  ⏭️  Skipping $(basename "$file") (WebP already exists and is up to date)"
    continue
  fi

  original_size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null || echo "0")
  convert_to_webp "$file"
  webp_size=$(stat -f%z "$webp_file" 2>/dev/null || stat -c%s "$webp_file" 2>/dev/null || echo "0")
  savings=$((original_size - webp_size))
  total_savings=$((total_savings + savings))
  converted_count=$((converted_count + 1))
done < <(find "$IMAGES_DIR" -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \) -print0)

echo ""
echo "🎉 Conversion complete!"
echo "📊 Summary:"
echo "   • Files converted: $converted_count"
echo "   • Total space saved: $(numfmt --to=iec-i --suffix=B "$total_savings")"

if [ "$converted_count" -gt 0 ]; then
  echo ""
  echo "📝 Next steps:"
  echo "   1. Update app.config.js to reference .webp files instead of .png/.jpg"
  echo "   2. Test the app to ensure images display correctly"
  echo "   3. Remove the original PNG/JPG files if everything works"
  echo "   4. Commit the WebP files and app.config.js changes"
fi

echo ""
echo "📁 Generated WebP files:"
find "$IMAGES_DIR" -name "*.webp" -exec ls -lh {} \;
