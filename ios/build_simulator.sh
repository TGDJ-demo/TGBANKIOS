#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DERIVED_DATA_PATH="${DERIVED_DATA_PATH:-$PROJECT_DIR/build/DerivedData}"

xcodebuild \
  -project "$PROJECT_DIR/TGBank.xcodeproj" \
  -scheme TGBank \
  -configuration Debug \
  -destination 'generic/platform=iOS Simulator' \
  -derivedDataPath "$DERIVED_DATA_PATH" \
  CODE_SIGNING_ALLOWED=NO \
  build

echo "Built simulator app: $DERIVED_DATA_PATH/Build/Products/Debug-iphonesimulator/TGBank.app"
