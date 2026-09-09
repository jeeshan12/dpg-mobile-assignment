#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APPS_DIR="$ROOT_DIR/apps"
mkdir -p "$APPS_DIR/android" "$APPS_DIR/ios"

ANDROID_APK_URL="https://raw.githubusercontent.com/tchumakina/video-qa-challenge-android/main/bin/VideoQAChallenge-debug.apk"
IOS_APP_ZIP_URL="https://raw.githubusercontent.com/tchumakina/video-qa-challenge-ios/main/bin/VideoQAChallenge-simulator.app.zip"

echo "Fetching Android debug APK..."
curl -fL "$ANDROID_APK_URL" -o "$APPS_DIR/android/VideoQAChallenge-debug.apk"

echo "Fetching iOS simulator build..."
curl -fL "$IOS_APP_ZIP_URL" -o "$APPS_DIR/ios/VideoQAChallenge-simulator.app.zip"
rm -rf "$APPS_DIR/ios/VideoQAChallenge.app"
unzip -q -o "$APPS_DIR/ios/VideoQAChallenge-simulator.app.zip" -d "$APPS_DIR/ios"

echo "Done. Binaries are in $APPS_DIR (gitignored)."
