#!/usr/bin/env bash
# TG Bank Xcode IPA Build & Archive Script for macOS / TestGrid
set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

echo "=== Building TG Bank with xcodebuild ==="
mkdir -p build

# 1. Build Archive
xcodebuild clean archive \
  -project TGBank.xcodeproj \
  -scheme TGBank \
  -configuration Debug \
  -destination 'generic/platform=iOS' \
  -archivePath build/TGBank.xcarchive \
  CODE_SIGNING_ALLOWED=NO \
  CODE_SIGNING_REQUIRED=NO

echo "=== Extracting Payload into TGBank-debug.ipa ==="
rm -rf build/Payload build/TGBank-debug.ipa
mkdir -p build/Payload
cp -R build/TGBank.xcarchive/Products/Applications/TGBank.app build/Payload/
cd build
zip -q -r TGBank-debug.ipa Payload
echo "[SUCCESS] Generated build/TGBank-debug.ipa"
