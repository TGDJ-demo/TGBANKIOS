import SwiftUI
import LocalAuthentication
#if canImport(UIKit)
import UIKit
#endif

public struct LoginView: View {
    @EnvironmentObject var repository: BankRepository
    @State private var username: String = ""
    @State private var pin: String = ""
    @State private var isPinVisible: Bool = false
    @State private var errorMessage: String? = nil
    @State private var showBiometricPrompt: Bool = false

    public init() {}

    public var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                Spacer().frame(height: 40)

                // Logo & Header
                VStack(spacing: 8) {
                    Image(systemName: "building.columns.fill")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 64, height: 64)
                        .foregroundColor(.tgSapphire)
                        .accessibilityIdentifier("tgBank.login.logo")

                    Text("TG Bank Mobile")
                        .font(.system(size: 28, weight: .semibold, design: .serif))
                        .accessibilityIdentifier("tgBank.login.title")

                    Text("Secure Enterprise Banking")
                        .font(.system(size: 15))
                        .foregroundColor(.secondary)
                        .accessibilityIdentifier("tgBank.login.subtitle")
                }

                // Demo account indicator
                HStack(spacing: 6) {
                    Circle()
                        .fill(Color.tgTeal)
                        .frame(width: 8, height: 8)
                    Text("Predefined Demo Account: Sanjay G / 1234")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                .padding(.horizontal, 12)
                .padding(.vertical, 6)
                .background(Color(uiColor: .systemGray6))
                .cornerRadius(12)
                .accessibilityIdentifier("tgBank.login.demoAccountIndicator")

                // Form
                VStack(spacing: 16) {
                    // Username Field
                    VStack(alignment: .leading, spacing: 6) {
                        Text("Username / Customer ID")
                            .font(.caption)
                            .foregroundColor(.secondary)
                        TextField("Enter username", text: $username)
                            .padding()
                            .background(Color(uiColor: .systemBackground))
                            .cornerRadius(10)
                            .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color(uiColor: .systemGray4), lineWidth: 1))
                            .autocapitalization(.none)
                            .accessibilityIdentifier("tgBank.login.usernameField")
                    }

                    // PIN Field
                    VStack(alignment: .leading, spacing: 6) {
                        Text("4-digit Security PIN")
                            .font(.caption)
                            .foregroundColor(.secondary)
                        HStack {
                            if isPinVisible {
                                TextField("Enter 4-digit PIN", text: $pin)
                            } else {
                                SecureField("Enter 4-digit PIN", text: $pin)
                            }

                            Button(action: { isPinVisible.toggle() }) {
                                Image(systemName: isPinVisible ? "eye.slash.fill" : "eye.fill")
                                    .foregroundColor(.secondary)
                            }
                            .accessibilityIdentifier("tgBank.login.pinVisibilityButton")
                        }
                        .padding()
                        .background(Color(uiColor: .systemBackground))
                        .cornerRadius(10)
                        .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color(uiColor: .systemGray4), lineWidth: 1))
                        #if os(iOS)
                        .keyboardType(.numberPad)
                        #endif
                        .accessibilityIdentifier("tgBank.login.pinField")
                    }

                    // Error message
                    if let err = errorMessage {
                        HStack {
                            Image(systemName: "exclamationmark.triangle.fill")
                                .foregroundColor(.red)
                            Text(err)
                                .font(.footnote)
                                .foregroundColor(.red)
                        }
                        .padding(.vertical, 4)
                        .accessibilityIdentifier("tgBank.login.errorMessage")
                    }

                    // Sign In Button
                    Button(action: performSignIn) {
                        Text("Sign In Securely")
                            .font(.headline)
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .frame(height: 50)
                            .background(Color.tgSapphire)
                            .cornerRadius(10)
                    }
                    .accessibilityIdentifier("tgBank.login.signInButton")

                    // Biometric Button
                    Button(action: performBiometricLogin) {
                        HStack {
                            Image(systemName: "faceid")
                            Text("Login with Fingerprint / Face")
                        }
                        .font(.subheadline)
                        .foregroundColor(.tgSapphire)
                        .frame(maxWidth: .infinity)
                        .frame(height: 48)
                        .background(Color.tgSapphire.opacity(0.1))
                        .cornerRadius(10)
                    }
                    .accessibilityIdentifier("tgBank.login.biometricButton")

                    // Use Demo Credentials
                    Button(action: autofillDemoCredentials) {
                        HStack {
                            Image(systemName: "wand.and.stars")
                            Text("Use Demo Credentials")
                        }
                        .font(.subheadline)
                        .foregroundColor(.primary)
                        .frame(maxWidth: .infinity)
                        .frame(height: 44)
                        .background(Color(uiColor: .systemGray6))
                        .cornerRadius(10)
                    }
                    .accessibilityIdentifier("tgBank.login.demoCredentialsButton")

                    // Forgot PIN
                    Button(action: {
                        errorMessage = "Demo PIN is 1234. Use Demo Credentials button."
                    }) {
                        Text("Forgot PIN?")
                            .font(.footnote)
                            .foregroundColor(.secondary)
                    }
                    .accessibilityIdentifier("tgBank.login.forgotPinButton")
                }
                .padding(.horizontal, 24)

                Spacer()
            }
        }
        .background(Color(uiColor: .systemGroupedBackground))
        .accessibilityIdentifier("tgBank.login.screen")
    }

    private func performSignIn() {
        if username == "Sanjay G" && pin == "1234" {
            errorMessage = nil
            _ = repository.authenticate(pin: pin)
        } else {
            errorMessage = "Invalid credentials. Use Sanjay G / 1234."
        }
    }

    private func autofillDemoCredentials() {
        username = "Sanjay G"
        pin = "1234"
        errorMessage = nil
    }

    private func performBiometricLogin() {
        if repository.testControls.mockBiometricSuccess {
            username = "Sanjay G"
            pin = "1234"
            _ = repository.authenticate(pin: "1234")
            return
        }

        let context = LAContext()
        var error: NSError?
        if context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) {
            context.evaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, localizedReason: "Authenticate to TG Bank") { success, _ in
                DispatchQueue.main.async {
                    if success {
                        username = "Sanjay G"
                        pin = "1234"
                        _ = self.repository.authenticate(pin: "1234")
                    } else {
                        self.errorMessage = "Biometric authentication failed."
                    }
                }
            }
        } else {
            // Simulator or hardware unavailable
            self.errorMessage = "Biometrics unavailable. Enable Mock Biometric in Test Controls or use PIN."
        }
    }
}
