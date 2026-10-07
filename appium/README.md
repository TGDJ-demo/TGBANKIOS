# Appium on iOS

The application is SwiftUI-native and exposes stable accessibility identifiers.
Use Appium's XCUITest driver; use the simulator `.app` for simulator sessions
and a signed IPA for a physical-device session.

## Simulator session

From the repository root:

```sh
ios/build_simulator.sh
npm install --global appium
appium driver install xcuitest
appium --base-path /wd/hub
```

Create an Appium session using
[ios-simulator.capabilities.json](./ios-simulator.capabilities.json) while
running the Appium server from the repository root. The app path in that file
is relative to the repository root. Install Xcode command line tools and boot
an iOS Simulator before starting a session.

To point at a different simulator, update `appium:deviceName`; to use another
Xcode build location, update `appium:app`. The bundle ID is
`com.apple.tgbank`.

## Physical iOS device

Build a development-signed IPA using the steps in the repository
[README](../README.md), install/authorize the device with Xcode, then set
`appium:udid` to the device UDID and `appium:app` to the signed IPA path. Apple
device automation requires a valid developer signing identity and provisioning
profile; the repository intentionally contains no signing credentials.

## Locator contract

Use Appium's `accessibility id` strategy with the identifiers in the native
SwiftUI views. For example:

```js
await driver.$('~tgBank.login.demoCredentialsButton').click();
await driver.$('~tgBank.login.signInButton').click();
await driver.$('~tgBank.home.accountBalance').waitForDisplayed();
```

The existing `ios/TGBankUITests/TGBankUITests.swift` suite demonstrates login,
payments, loans, KYC, and test-control flows using the same identifiers.
