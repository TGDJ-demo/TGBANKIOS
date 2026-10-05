import SwiftUI
#if canImport(UIKit)
import UIKit
#endif

public struct SendMoneyView: View {
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var repository: BankRepository

    @State private var step: Int = 1 // 1: Details, 2: Review, 3: Success
    @State private var recipient: String = ""
    @State private var account: String = ""
    @State private var ifsc: String = ""
    @State private var rail: TransferRail = .imps
    @State private var amountString: String = ""
    @State private var note: String = ""
    @State private var saveBeneficiary: Bool = false
    @State private var errorMessage: String? = nil

    // Review & Auth
    @State private var showAuthDialog: Bool = false
    @State private var authMethod: String = "MPIN" // MPIN, Biometric, OTP
    @State private var authPin: String = ""
    @State private var authOtp: String = ""
    @State private var authError: String? = nil

    // Success state
    @State private var successTxId: String = ""
    @State private var successRef: String = ""

    public init() {}

    public var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // Step Indicator
                HStack(spacing: 8) {
                    StepBadge(num: 1, title: "Details", active: step >= 1)
                    Rectangle().frame(height: 2).foregroundColor(step >= 2 ? .blue : Color(uiColor: .systemGray4))
                    StepBadge(num: 2, title: "Review", active: step >= 2)
                    Rectangle().frame(height: 2).foregroundColor(step >= 3 ? .blue : Color(uiColor: .systemGray4))
                    StepBadge(num: 3, title: "Success", active: step >= 3)
                }
                .padding()
                .background(Color(uiColor: .secondarySystemGroupedBackground))
                .accessibilityIdentifier("tgBank.sendMoney.stepIndicator")

                ScrollView {
                    if step == 1 {
                        detailsStepView
                    } else if step == 2 {
                        reviewStepView
                    } else {
                        successStepView
                    }
                }
            }
            .background(Color(uiColor: .systemGroupedBackground))
            .navigationTitle("Send Money")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Cancel") {
                        dismiss()
                    }
                    .accessibilityIdentifier("tgBank.sendMoney.cancelButton")
                }
            }
            .sheet(isPresented: $showAuthDialog) {
                paymentAuthSheet
            }
            .accessibilityIdentifier("tgBank.sendMoney.screen")
        }
    }

    // Step 1: Details
    private var detailsStepView: some View {
        VStack(spacing: 16) {
            // Beneficiaries horizontal list
            VStack(alignment: .leading, spacing: 8) {
                Text("Saved Beneficiaries")
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .padding(.horizontal)

                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 10) {
                        ForEach(repository.beneficiaries) { ben in
                            Button(action: {
                                selectBeneficiary(ben)
                            }) {
                                VStack(spacing: 4) {
                                    Circle()
                                        .fill(Color.blue.opacity(0.12))
                                        .frame(width: 44, height: 44)
                                        .overlay(Text(String(ben.nickname.prefix(2))).font(.subheadline).bold().foregroundColor(.blue))
                                    Text(ben.nickname)
                                        .font(.caption2)
                                        .foregroundColor(.primary)
                                    Text(ben.rail.rawValue)
                                        .font(.system(size: 9))
                                        .foregroundColor(.secondary)
                                }
                                .frame(width: 72)
                                .padding(.vertical, 8)
                                .background(Color(uiColor: .secondarySystemGroupedBackground))
                                .cornerRadius(10)
                            }
                            .accessibilityIdentifier("tgBank.sendMoney.beneficiary.\(ben.id)")
                        }
                    }
                    .padding(.horizontal)
                }
                .accessibilityIdentifier("tgBank.sendMoney.beneficiaryList")
            }

            VStack(spacing: 12) {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Recipient Name").font(.caption).foregroundColor(.secondary)
                    TextField("Enter recipient name", text: $recipient)
                        .padding()
                        .background(Color(uiColor: .systemBackground))
                        .cornerRadius(8)
                        .accessibilityIdentifier("tgBank.sendMoney.recipientField")
                }

                VStack(alignment: .leading, spacing: 4) {
                    Text("Account Number").font(.caption).foregroundColor(.secondary)
                    TextField("Enter account number", text: $account)
                        .padding()
                        .background(Color(uiColor: .systemBackground))
                        .cornerRadius(8)
                        #if os(iOS)
                        .keyboardType(.numberPad)
                        #endif
                        .accessibilityIdentifier("tgBank.sendMoney.accountField")
                }

                VStack(alignment: .leading, spacing: 4) {
                    Text("IFSC / Routing Code").font(.caption).foregroundColor(.secondary)
                    TextField("Enter IFSC/Routing", text: $ifsc)
                        .padding()
                        .background(Color(uiColor: .systemBackground))
                        .cornerRadius(8)
                        .accessibilityIdentifier("tgBank.sendMoney.ifscField")
                }

                // Transfer Rail
                VStack(alignment: .leading, spacing: 4) {
                    Text("Transfer Rail").font(.caption).foregroundColor(.secondary)
                    Picker("Rail", selection: $rail) {
                        Text("IMPS").tag(TransferRail.imps).accessibilityIdentifier("tgBank.sendMoney.transferRail.imps")
                        Text("NEFT").tag(TransferRail.neft).accessibilityIdentifier("tgBank.sendMoney.transferRail.neft")
                        Text("ACH").tag(TransferRail.ach).accessibilityIdentifier("tgBank.sendMoney.transferRail.ach")
                        Text("RTGS").tag(TransferRail.rtgs).accessibilityIdentifier("tgBank.sendMoney.transferRail.rtgs")
                    }
                    .pickerStyle(.segmented)
                    .accessibilityIdentifier("tgBank.sendMoney.transferRailPicker")
                }

                // Amount
                VStack(alignment: .leading, spacing: 4) {
                    Text("Amount (USD)").font(.caption).foregroundColor(.secondary)
                    TextField("0.00", text: $amountString)
                        .padding()
                        .background(Color(uiColor: .systemBackground))
                        .cornerRadius(8)
                        #if os(iOS)
                        .keyboardType(.decimalPad)
                        #endif
                        .accessibilityIdentifier("tgBank.sendMoney.amountField")

                    // Quick amounts
                    HStack {
                        QuickAmountButton(amount: 5000, id: "tgBank.sendMoney.quickAmount.5000") { amountString = "5000" }
                        QuickAmountButton(amount: 25000, id: "tgBank.sendMoney.quickAmount.25000") { amountString = "25000" }
                        QuickAmountButton(amount: 50000, id: "tgBank.sendMoney.quickAmount.50000") { amountString = "50000" }
                        QuickAmountButton(amount: 100000, id: "tgBank.sendMoney.quickAmount.100000") { amountString = "100000" }
                    }
                }

                VStack(alignment: .leading, spacing: 4) {
                    Text("Note / Memo").font(.caption).foregroundColor(.secondary)
                    TextField("Optional note", text: $note)
                        .padding()
                        .background(Color(uiColor: .systemBackground))
                        .cornerRadius(8)
                        .accessibilityIdentifier("tgBank.sendMoney.noteField")
                }

                Toggle("Save as Beneficiary", isOn: $saveBeneficiary)
                    .font(.footnote)
                    .padding(.top, 4)
                    .accessibilityIdentifier("tgBank.sendMoney.saveBeneficiary")

                if let err = errorMessage {
                    Text(err)
                        .font(.footnote)
                        .foregroundColor(.red)
                        .accessibilityIdentifier("tgBank.sendMoney.errorMessage")
                }

                Button(action: proceedToReview) {
                    Text("Continue")
                        .font(.headline)
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .frame(height: 50)
                        .background(Color.blue)
                        .cornerRadius(10)
                }
                .accessibilityIdentifier("tgBank.sendMoney.continueButton")
            }
            .padding()
            .background(Color(uiColor: .secondarySystemGroupedBackground))
            .cornerRadius(16)
            .padding(.horizontal)
            .accessibilityIdentifier("tgBank.sendMoney.detailsCard")
        }
    }

    // Step 2: Review
    private var reviewStepView: some View {
        VStack(spacing: 20) {
            VStack(spacing: 16) {
                Text("Review Transfer Details")
                    .font(.headline)

                Divider()

                VStack(alignment: .center, spacing: 4) {
                    Text("Transfer Amount")
                        .font(.caption)
                        .foregroundColor(.secondary)
                    Text("$\(Double(amountString) ?? 0, specifier: "%.2f")")
                        .font(.system(size: 32, weight: .bold))
                        .foregroundColor(.blue)
                        .accessibilityIdentifier("tgBank.sendMoney.reviewAmount")
                }

                VStack(spacing: 10) {
                    ReviewRow(label: "Recipient", val: recipient, id: "tgBank.sendMoney.reviewRecipient")
                    ReviewRow(label: "Account", val: account, id: "tgBank.sendMoney.reviewAccount")
                    ReviewRow(label: "Rail", val: rail.rawValue, id: "tgBank.sendMoney.reviewRail")
                    ReviewRow(label: "Note", val: note.isEmpty ? "Family Transfer" : note, id: "tgBank.sendMoney.reviewNote")
                }

                Divider()

                HStack(spacing: 12) {
                    Button(action: { step = 1 }) {
                        Text("Back to Edit")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                            .frame(maxWidth: .infinity)
                            .frame(height: 48)
                            .background(Color(uiColor: .systemGray5))
                            .cornerRadius(10)
                    }
                    .accessibilityIdentifier("tgBank.sendMoney.backToEditButton")

                    Button(action: {
                        if repository.testControls.requirePaymentAuth {
                            showAuthDialog = true
                        } else {
                            completeTransfer()
                        }
                    }) {
                        Text("Authorize & Pay")
                            .font(.headline)
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .frame(height: 48)
                            .background(Color.blue)
                            .cornerRadius(10)
                    }
                    .accessibilityIdentifier("tgBank.sendMoney.authorizationButton")
                }
            }
            .padding()
            .background(Color(uiColor: .secondarySystemGroupedBackground))
            .cornerRadius(16)
            .padding(.horizontal)
            .accessibilityIdentifier("tgBank.sendMoney.reviewCard")
        }
    }

    // Step 3: Success
    private var successStepView: some View {
        VStack(spacing: 24) {
            VStack(spacing: 16) {
                Image(systemName: "checkmark.circle.fill")
                    .resizable()
                    .frame(width: 64, height: 64)
                    .foregroundColor(.green)

                Text("Transfer Successful")
                    .font(.title2)
                    .bold()
                    .accessibilityIdentifier("tgBank.sendMoney.successTitle")

                Text("$\(Double(amountString) ?? 0, specifier: "%.2f")")
                    .font(.system(size: 32, weight: .bold))
                    .accessibilityIdentifier("tgBank.sendMoney.successAmount")

                VStack(spacing: 8) {
                    ReviewRow(label: "Recipient", val: recipient, id: "tgBank.sendMoney.successRecipient")
                    ReviewRow(label: "Reference ID", val: successRef, id: "tgBank.sendMoney.successReference")
                    ReviewRow(label: "Transaction ID", val: successTxId, id: "tgBank.sendMoney.successTransactionId")
                }

                Button(action: { dismiss() }) {
                    Text("Done")
                        .font(.headline)
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .frame(height: 50)
                        .background(Color.green)
                        .cornerRadius(10)
                }
                .accessibilityIdentifier("tgBank.sendMoney.successDoneButton")
            }
            .padding()
            .background(Color(uiColor: .secondarySystemGroupedBackground))
            .cornerRadius(16)
            .padding(.horizontal)
            .accessibilityIdentifier("tgBank.sendMoney.successCard")
        }
    }

    // Payment Authorization Sheet
    private var paymentAuthSheet: some View {
        NavigationStack {
            VStack(spacing: 20) {
                Text("Authorize Payment")
                    .font(.headline)

                VStack(spacing: 4) {
                    Text("Amount: $\(Double(amountString) ?? 0, specifier: "%.2f")")
                        .font(.subheadline)
                        .bold()
                        .accessibilityIdentifier("tgBank.paymentAuth.amount")
                    Text("To: \(recipient)")
                        .font(.caption)
                        .foregroundColor(.secondary)
                        .accessibilityIdentifier("tgBank.paymentAuth.recipient")
                }

                // Method picker
                Picker("Auth Method", selection: $authMethod) {
                    Text("MPIN").tag("MPIN").accessibilityIdentifier("tgBank.paymentAuth.mpinOption")
                    Text("Biometric").tag("Biometric").accessibilityIdentifier("tgBank.paymentAuth.biometricOption")
                    Text("OTP").tag("OTP").accessibilityIdentifier("tgBank.paymentAuth.otpOption")
                }
                .pickerStyle(.segmented)

                if authMethod == "MPIN" {
                    VStack(alignment: .leading, spacing: 6) {
                        Text("Enter 4-digit MPIN").font(.caption).foregroundColor(.secondary)
                        SecureField("1234", text: $authPin)
                            .padding()
                            .background(Color(uiColor: .systemBackground))
                            .cornerRadius(8)
                            #if os(iOS)
                            .keyboardType(.numberPad)
                            #endif
                            .accessibilityIdentifier("tgBank.paymentAuth.mpinField")

                        Button("Verify MPIN") {
                            if authPin == "1234" {
                                showAuthDialog = false
                                completeTransfer()
                            } else {
                                authError = "Invalid MPIN (Use 1234)"
                            }
                        }
                        .font(.headline)
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .frame(height: 44)
                        .background(Color.blue)
                        .cornerRadius(8)
                        .accessibilityIdentifier("tgBank.paymentAuth.mpinVerifyButton")

                        Button("Cancel") { showAuthDialog = false }
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                            .frame(maxWidth: .infinity)
                            .accessibilityIdentifier("tgBank.paymentAuth.mpinCancelButton")
                    }
                } else if authMethod == "Biometric" {
                    VStack(spacing: 12) {
                        Image(systemName: "faceid")
                            .font(.system(size: 48))
                            .foregroundColor(.blue)

                        Button("Verify with Face ID / Touch ID") {
                            showAuthDialog = false
                            completeTransfer()
                        }
                        .font(.headline)
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .frame(height: 44)
                        .background(Color.blue)
                        .cornerRadius(8)
                        .accessibilityIdentifier("tgBank.paymentAuth.biometricButton")
                    }
                } else {
                    VStack(alignment: .leading, spacing: 6) {
                        Text("Enter 6-digit OTP (Demo: 998811)").font(.caption).foregroundColor(.secondary)
                        TextField("998811", text: $authOtp)
                            .padding()
                            .background(Color(uiColor: .systemBackground))
                            .cornerRadius(8)
                            #if os(iOS)
                            .keyboardType(.numberPad)
                            #endif
                            .accessibilityIdentifier("tgBank.paymentAuth.otpField")

                        Button("Verify OTP") {
                            showAuthDialog = false
                            completeTransfer()
                        }
                        .font(.headline)
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .frame(height: 44)
                        .background(Color.blue)
                        .cornerRadius(8)
                        .accessibilityIdentifier("tgBank.paymentAuth.otpVerifyButton")

                        Button("Cancel") { showAuthDialog = false }
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                            .frame(maxWidth: .infinity)
                            .accessibilityIdentifier("tgBank.paymentAuth.otpCancelButton")
                    }
                }

                if let err = authError {
                    Text(err)
                        .font(.footnote)
                        .foregroundColor(.red)
                        .accessibilityIdentifier("tgBank.paymentAuth.errorMessage")
                }
            }
            .padding()
            .background(Color(uiColor: .systemGroupedBackground))
            .accessibilityIdentifier("tgBank.paymentAuth.dialog")
        }
    }

    private func selectBeneficiary(_ ben: Beneficiary) {
        recipient = ben.name
        account = ben.account
        ifsc = ben.ifsc
        rail = ben.rail
    }

    private func proceedToReview() {
        guard !recipient.isEmpty, !account.isEmpty else {
            errorMessage = "Please enter recipient name and account number."
            return
        }
        guard let amt = Double(amountString), amt > 0 else {
            errorMessage = "Please enter a valid amount."
            return
        }
        errorMessage = nil
        step = 2
    }

    private func completeTransfer() {
        let amt = Double(amountString) ?? 0.0
        let res = repository.sendTransfer(
            recipient: recipient,
            account: account,
            rail: rail,
            amount: amt,
            note: note
        )

        if res.success {
            successTxId = res.txId ?? "TGX202609230008"
            successRef = res.ref ?? "REF-88991122"
            step = 3
        } else {
            step = 1
            errorMessage = res.error ?? "Transfer failed."
        }
    }
}

struct StepBadge: View {
    let num: Int
    let title: String
    let active: Bool

    var body: some View {
        HStack(spacing: 4) {
            Circle()
                .fill(active ? Color.blue : Color(uiColor: .systemGray4))
                .frame(width: 20, height: 20)
                .overlay(Text("\(num)").font(.caption2).bold().foregroundColor(.white))
            Text(title)
                .font(.caption2)
                .bold()
                .foregroundColor(active ? .blue : .secondary)
        }
    }
}

struct QuickAmountButton: View {
    let amount: Int
    let id: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text("$\(amount / 1000)k")
                .font(.caption2)
                .bold()
                .padding(.horizontal, 10)
                .padding(.vertical, 6)
                .background(Color(uiColor: .systemGray5))
                .cornerRadius(6)
        }
        .accessibilityIdentifier(id)
    }
}

struct ReviewRow: View {
    let label: String
    let val: String
    let id: String

    var body: some View {
        HStack {
            Text(label).font(.caption).foregroundColor(.secondary)
            Spacer()
            Text(val).font(.caption).bold()
        }
        .accessibilityIdentifier(id)
    }
}
