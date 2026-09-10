#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APPS_DIR="$ROOT_DIR/apps"
mkdir -p "$APPS_DIR/android" "$APPS_DIR/ios"

ANDROID_APK="$APPS_DIR/android/VideoQAChallenge-debug.apk"
IOS_APP="$APPS_DIR/ios/VideoQAChallenge.app"
IOS_APP_ZIP="$APPS_DIR/ios/VideoQAChallenge-simulator.app.zip"

ANDROID_APK_URL="https://raw.githubusercontent.com/tchumakina/video-qa-challenge-android/main/bin/VideoQAChallenge-debug.apk"
IOS_APP_ZIP_URL="https://raw.githubusercontent.com/tchumakina/video-qa-challenge-ios/main/bin/VideoQAChallenge-simulator.app.zip"

if [ ! -f "$ANDROID_APK" ]; then
  echo "Fetching Android debug APK..."
  curl -fL "$ANDROID_APK_URL" -o "$ANDROID_APK"
fi

if [ ! -d "$IOS_APP" ]; then
  echo "Fetching iOS simulator build..."
  curl -fL "$IOS_APP_ZIP_URL" -o "$IOS_APP_ZIP"
  rm -rf "$IOS_APP"
  unzip -q -o "$IOS_APP_ZIP" -d "$APPS_DIR/ios"
  rm -f "$IOS_APP_ZIP"
fi

echo "✓ Application binaries are ready in $APPS_DIR"

