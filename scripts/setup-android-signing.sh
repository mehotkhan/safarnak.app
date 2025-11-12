#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
KS_DIR="${REPO_DIR}/.keystore"
KS_FILE="${KS_DIR}/release.jks"
B64_FILE="${KS_DIR}/release.jks.b64"
INFO_FILE="${KS_DIR}/README.txt"

command -v keytool >/dev/null 2>&1 || { echo "Error: keytool not found"; exit 1; }
command -v gh >/dev/null 2>&1 || { echo "Error: gh CLI not found"; exit 1; }

mkdir -p "${KS_DIR}"

ALIAS="safarnak-release"
STOREPASS="$(tr -dc 'A-Za-z0-9' </dev/urandom | head -c 32)"
KEYPASS="$(tr -dc 'A-Za-z0-9' </dev/urandom | head -c 32)"

keytool -genkeypair \
  -alias "${ALIAS}" \
  -keyalg RSA \
  -keysize 2048 \
  -validity 9125 \
  -keystore "${KS_FILE}" \
  -storepass "${STOREPASS}" \
  -keypass "${KEYPASS}" \
  -dname "CN=Safarnak, OU=Engineering, O=Safarnak, L=Tehran, ST=Tehran, C=IR" \
  >/dev/null 2>&1

base64 -w 0 "${KS_FILE}" > "${B64_FILE}"

{
  echo "Keystore: ${KS_FILE}"
  echo "Alias: ${ALIAS}"
  echo "Store Password: ${STOREPASS}"
  echo "Key Password: ${KEYPASS}"
  echo "Created: $(date -u)"
} > "${INFO_FILE}"
chmod 600 "${INFO_FILE}"

# Set GitHub Actions secrets (repository scope)
gh secret set ANDROID_KEYSTORE_BASE64 --app actions --body "$(cat "${B64_FILE}")" >/dev/null
gh secret set ANDROID_KEY_ALIAS --app actions --body "${ALIAS}" >/dev/null
gh secret set ANDROID_KEYSTORE_PASSWORD --app actions --body "${STOREPASS}" >/dev/null
gh secret set ANDROID_KEY_PASSWORD --app actions --body "${KEYPASS}" >/dev/null

echo "✅ Keystore generated and GitHub Actions secrets set."


