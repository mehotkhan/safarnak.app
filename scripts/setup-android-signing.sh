#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
KS_DIR="${REPO_DIR}/.keystore"
KS_FILE="${KS_DIR}/release.jks"
B64_FILE="${KS_DIR}/release.jks.b64"
INFO_FILE="${KS_DIR}/README.txt"
SECRET_FILE="${KS_DIR}/secrets.env"
REPO="mehotkhan/safarnak.app"

command -v keytool >/dev/null 2>&1 || { echo "Error: keytool not found"; exit 1; }
command -v gh >/dev/null 2>&1 || { echo "Error: gh CLI not found"; exit 1; }
command -v openssl >/dev/null 2>&1 || { echo "Error: openssl not found"; exit 1; }

mkdir -p "${KS_DIR}"

ALIAS="safarnak-release"
STOREPASS="$(openssl rand -hex 16)"
KEYPASS="${STOREPASS}"

if [[ -f "${KS_FILE}" || -f "${B64_FILE}" ]]; then
  BACKUP_STAMP="$(date -u +%Y%m%d%H%M%S)"
  [[ -f "${KS_FILE}" ]] && mv "${KS_FILE}" "${KS_FILE}.${BACKUP_STAMP}.bak"
  [[ -f "${B64_FILE}" ]] && mv "${B64_FILE}" "${B64_FILE}.${BACKUP_STAMP}.bak"
fi

keytool -genkeypair \
  -alias "${ALIAS}" \
  -keyalg RSA \
  -keysize 2048 \
  -validity 9125 \
  -storetype PKCS12 \
  -keystore "${KS_FILE}" \
  -storepass "${STOREPASS}" \
  -keypass "${KEYPASS}" \
  -dname "CN=Safarnak, OU=Engineering, O=Safarnak, L=Tehran, ST=Tehran, C=IR" \
  >/dev/null 2>&1

keytool -list \
  -keystore "${KS_FILE}" \
  -storepass "${STOREPASS}" \
  -alias "${ALIAS}" \
  >/dev/null 2>&1

base64 -w 0 "${KS_FILE}" > "${B64_FILE}"

{
  echo "Keystore: ${KS_FILE}"
  echo "Alias: ${ALIAS}"
  echo "Secrets File: ${SECRET_FILE}"
  echo "GitHub Secrets: SAFARNAK_ANDROID_KEYSTORE_BASE64, SAFARNAK_ANDROID_KEYSTORE_PASSWORD, SAFARNAK_ANDROID_KEY_ALIAS, SAFARNAK_ANDROID_KEY_PASSWORD"
  echo "Created: $(date -u)"
} > "${INFO_FILE}"
chmod 600 "${INFO_FILE}"

{
  echo "SAFARNAK_ANDROID_KEYSTORE=${KS_FILE}"
  echo "SAFARNAK_ANDROID_KEYSTORE_PASSWORD=${STOREPASS}"
  echo "SAFARNAK_ANDROID_KEY_ALIAS=${ALIAS}"
  echo "SAFARNAK_ANDROID_KEY_PASSWORD=${KEYPASS}"
} > "${SECRET_FILE}"
chmod 600 "${SECRET_FILE}"

# Set GitHub Actions secrets (repository scope)
gh secret set SAFARNAK_ANDROID_KEYSTORE_BASE64 --repo "${REPO}" --body "$(cat "${B64_FILE}")" >/dev/null
gh secret set SAFARNAK_ANDROID_KEY_ALIAS --repo "${REPO}" --body "${ALIAS}" >/dev/null
gh secret set SAFARNAK_ANDROID_KEYSTORE_PASSWORD --repo "${REPO}" --body "${STOREPASS}" >/dev/null
gh secret set SAFARNAK_ANDROID_KEY_PASSWORD --repo "${REPO}" --body "${KEYPASS}" >/dev/null

echo "Keystore generated, verified, and GitHub Actions secrets set."
