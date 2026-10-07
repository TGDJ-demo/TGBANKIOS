# TG Bank for iOS

TG Bank is a native SwiftUI iOS application. The iOS target contains no web view,
JavaScript runtime, or hybrid UI layer. Its stable accessibility identifiers are
used by the included XCUITest suite and by Appium's XCUITest driver.

## Open and build

Open `ios/TGBank.xcodeproj` in Xcode and select the **TGBank** scheme.

Build for the iOS Simulator from the repository root:

```sh
ios/build_simulator.sh
```

The resulting simulator app is at
`ios/build/DerivedData/Build/Products/Debug-iphonesimulator/TGBank.app`.
Run the native UI tests with:

```sh
xcodebuild test \
  -project ios/TGBank.xcodeproj \
  -scheme TGBank \
  -destination 'platform=iOS Simulator,name=iPhone 17 Pro' \
  -derivedDataPath ios/build/DerivedData \
  CODE_SIGNING_ALLOWED=NO
```

## Device IPA and signing

An IPA for a physical iPhone/iPad must be signed with a valid Apple Developer
team, signing identity, and provisioning profile. Xcode can manage these when
an Apple Developer account is configured in Xcode. Then run:

```sh
DEVELOPMENT_TEAM=YOUR_TEAM_ID ios/build_ipa.sh
```

The script creates `ios/build/TGBank.ipa` via `xcodebuild archive` and
`xcodebuild -exportArchive`; it does not fabricate certificates or signatures.
Optionally set `PROVISIONING_PROFILE_SPECIFIER` or `CODE_SIGN_IDENTITY` when
your team's signing setup requires them. An IPA cannot be validly resigned
without the corresponding Apple-issued identity and provisioning profile.

The application bundle identifier is `com.apple.tgbank`.

## Appium

See [Appium setup and capabilities](./appium/README.md). Use the simulator
`.app` for simulator automation, or the signed IPA for a physical device.
