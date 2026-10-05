import SwiftUI
#if canImport(UIKit)
import UIKit
#endif

public struct TestControlsView: View {
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var repository: BankRepository

    @State private var statusMessage: String? = nil

    public init() {}

    public var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    // Header explanation
                    VStack(alignment: .leading, spacing: 6) {
                        Text("TestGrid Automation & Edge Cases")
                            .font(.headline)
                        Text("Deterministic state simulation for automated mobile testing with Appium & XCUITest.")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.horizontal)

                    // Error Simulation Toggles
                    VStack(spacing: 14) {
                        Toggle("Force Insufficient Balance", isOn: $repository.testControls.forceInsufficientBalance)
                            .accessibilityIdentifier("tgBank.testControls.forceInsufficientBalance")

                        Divider()

                        Toggle("Force Transaction Failure", isOn: $repository.testControls.forceTransactionFailure)
                            .accessibilityIdentifier("tgBank.testControls.forceTransactionFailure")

                        Divider()

                        Toggle("Simulate Network Timeout", isOn: $repository.testControls.simulateNetworkTimeout)
                            .accessibilityIdentifier("tgBank.testControls.simulateNetworkTimeout")

                        Divider()

                        Toggle("Simulate Unverified KYC", isOn: $repository.testControls.simulateUnverifiedKyc)
                            .onChange(of: repository.testControls.simulateUnverifiedKyc) { val in
                                if val { repository.user.kycStatus = .incomplete }
                            }
                            .accessibilityIdentifier("tgBank.testControls.simulateUnverifiedKyc")

                        Divider()

                        Toggle("Mock Biometric Success", isOn: $repository.testControls.mockBiometricSuccess)
                            .accessibilityIdentifier("tgBank.testControls.mockBiometricSuccess")

                        Divider()

                        Toggle("Require Payment Auth", isOn: $repository.testControls.requirePaymentAuth)
                            .accessibilityIdentifier("tgBank.testControls.requirePaymentAuth")

                        Divider()

                        Toggle("Force OTP Always", isOn: $repository.testControls.forceOtpAlways)
                            .accessibilityIdentifier("tgBank.testControls.forceOtpAlways")
                    }
                    .padding()
                    .background(Color(uiColor: .secondarySystemGroupedBackground))
                    .cornerRadius(16)
                    .padding(.horizontal)
                    .accessibilityIdentifier("tgBank.testControls.card")

                    // Status Message
                    if let msg = statusMessage {
                        HStack {
                            Image(systemName: "checkmark.circle.fill").foregroundColor(.green)
                            Text(msg).font(.caption).bold().foregroundColor(.green)
                        }
                        .padding(.horizontal)
                        .accessibilityIdentifier("tgBank.testControls.statusMessage")
                    }

                    // Reset & Seed Action Buttons
                    VStack(spacing: 12) {
                        Button(action: {
                            repository.resetDemoData()
                            statusMessage = "Demo data reset successfully."
                            dismiss()
                        }) {
                            HStack {
                                Image(systemName: "arrow.counterclockwise.circle.fill").foregroundColor(.red)
                                Text("Reset Demo Data (Returns to Login)")
                                    .font(.subheadline)
                                    .bold()
                                    .foregroundColor(.red)
                                Spacer()
                            }
                            .padding()
                            .background(Color.red.opacity(0.1))
                            .cornerRadius(12)
                        }
                        .accessibilityIdentifier("tgBank.testControls.resetDemoDataButton")

                        Button(action: {
                            repository.resetKYC()
                            statusMessage = "KYC status reset to Incomplete."
                        }) {
                            HStack {
                                Image(systemName: "person.crop.circle.badge.exclamationmark").foregroundColor(.orange)
                                Text("Reset KYC Status (Incomplete)")
                                    .font(.subheadline)
                                    .bold()
                                    .foregroundColor(.primary)
                                Spacer()
                            }
                            .padding()
                            .background(Color(uiColor: .secondarySystemGroupedBackground))
                            .cornerRadius(12)
                        }
                        .accessibilityIdentifier("tgBank.testControls.resetKycButton")

                        Button(action: {
                            repository.resetCredit()
                            statusMessage = "Credit limits & utilization reset."
                        }) {
                            HStack {
                                Image(systemName: "creditcard.and.123").foregroundColor(.blue)
                                Text("Reset Credit Utilization ($0 used)")
                                    .font(.subheadline)
                                    .bold()
                                    .foregroundColor(.primary)
                                Spacer()
                            }
                            .padding()
                            .background(Color(uiColor: .secondarySystemGroupedBackground))
                            .cornerRadius(12)
                        }
                        .accessibilityIdentifier("tgBank.testControls.resetCreditButton")

                        Button(action: {
                            statusMessage = "Database seeded with default records."
                        }) {
                            HStack {
                                Image(systemName: "externaldrive.fill.badge.checkmark").foregroundColor(.green)
                                Text("Seed Demo Database")
                                    .font(.subheadline)
                                    .bold()
                                    .foregroundColor(.primary)
                                Spacer()
                            }
                            .padding()
                            .background(Color(uiColor: .secondarySystemGroupedBackground))
                            .cornerRadius(12)
                        }
                        .accessibilityIdentifier("tgBank.testControls.seedDatabaseButton")
                    }
                    .padding(.horizontal)

                    Spacer().frame(height: 24)
                }
                .padding(.vertical)
            }
            .background(Color(uiColor: .systemGroupedBackground))
            .navigationTitle("Test Controls")
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Done") { dismiss() }
                }
            }
            .accessibilityIdentifier("tgBank.testControls.screen")
        }
    }
}
