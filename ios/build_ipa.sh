#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BUILD_DIR="$PROJECT_DIR/build"
ARCHIVE_PATH="$BUILD_DIR/TGBank.xcarchive"
EXPORT_PATH="$BUILD_DIR/export"
EXPORT_OPTIONS="$BUILD_DIR/ExportOptions.plist"
EXPORT_METHOD="${EXPORT_METHOD:-development}"

if [[ -z "${DEVELOPMENT_TEAM:-}" ]]; then
  echo "Set DEVELOPMENT_TEAM to your Apple Developer Team ID; Xcode signing is required for a device IPA." >&2
  exit 2
fi

case "$EXPORT_METHOD" in
  development|ad-hoc|app-store-connect|enterprise) ;;
  *)
    echo "Unsupported EXPORT_METHOD: $EXPORT_METHOD" >&2
    exit 2
    ;;
esac

mkdir -p "$BUILD_DIR"
rm -rf "$ARCHIVE_PATH" "$EXPORT_PATH"

SIGNING_SETTINGS=(
  "DEVELOPMENT_TEAM=$DEVELOPMENT_TEAM"
  "CODE_SIGN_STYLE=Automatic"
  "CODE_SIGNING_ALLOWED=YES"
)
if [[ -n "${CODE_SIGN_IDENTITY:-}" ]]; then
  SIGNING_SETTINGS+=("CODE_SIGN_IDENTITY=$CODE_SIGN_IDENTITY")
fi
if [[ -n "${PROVISIONING_PROFILE_SPECIFIER:-}" ]]; then
  SIGNING_SETTINGS+=("PROVISIONING_PROFILE_SPECIFIER=$PROVISIONING_PROFILE_SPECIFIER")
fi

xcodebuild \
  -project "$PROJECT_DIR/TGBank.xcodeproj" \
  -scheme TGBank \
  -configuration Release \
  -destination 'generic/platform=iOS' \
  -archivePath "$ARCHIVE_PATH" \
  -allowProvisioningUpdates \
  "${SIGNING_SETTINGS[@]}" \
  archive

cat > "$EXPORT_OPTIONS" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>method</key>
  <string>$EXPORT_METHOD</string>
  <key>signingStyle</key>
  <string>automatic</string>
  <key>teamID</key>
  <string>$DEVELOPMENT_TEAM</string>
</dict>
</plist>
PLIST

xcodebuild \
  -exportArchive \
  -archivePath "$ARCHIVE_PATH" \
  -exportPath "$EXPORT_PATH" \
  -exportOptionsPlist "$EXPORT_OPTIONS" \
  -allowProvisioningUpdates

cp "$EXPORT_PATH/TGBank.ipa" "$BUILD_DIR/TGBank.ipa"
echo "Signed device IPA: $BUILD_DIR/TGBank.ipa"
