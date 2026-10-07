import SwiftUI
#if canImport(UIKit)
import UIKit
#endif

public struct WithdrawView: View {
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var repository: BankRepository

    @State private var method: String = "atm" // atm, bankTransfer, debitAccount
    @State private var amountString: String = ""
    @State private var errorMessage: String? = nil
    @State private var isSuccess: Bool = false
    @State private var txId: String = ""

    public init() {}

    public var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    if isSuccess {
                        VStack(spacing: 16) {
                            Image(systemName: "checkmark.circle.fill")
                                .resizable()
                                .frame(width: 64, height: 64)
                                .foregroundColor(.tgPink)

                            Text("Withdrawal Authorized")
                                .font(.title2)
                                .bold()
                                .accessibilityIdentifier("tgBank.withdraw.successTitle")

                            Text("Transaction ID: \(txId)")
                                .font(.caption)
                                .foregroundColor(.secondary)
                                .accessibilityIdentifier("tgBank.withdraw.transactionId")

                            Button("Done") { dismiss() }
                                .font(.headline)
                                .foregroundColor(.white)
                                .frame(maxWidth: .infinity)
                                .frame(height: 48)
                                .background(Color.tgPink)
                                .cornerRadius(10)
                                .accessibilityIdentifier("tgBank.withdraw.doneButton")
                        }
                        .padding()
                        .background(Color(uiColor: .secondarySystemGroupedBackground))
                        .cornerRadius(16)
                        .padding(.horizontal)
                        .accessibilityIdentifier("tgBank.withdraw.successCard")
                    } else {
                        VStack(spacing: 16) {
                            VStack(alignment: .leading, spacing: 4) {
                                Text("Withdrawal Method").font(.caption).foregroundColor(.secondary)
                                HStack(spacing: 8) {
                                    MethodButton(title: "ATM", active: method == "atm", id: "tgBank.withdraw.method.atm") { method = "atm" }
                                    MethodButton(title: "Bank Transfer", active: method == "bankTransfer", id: "tgBank.withdraw.method.bankTransfer") { method = "bankTransfer" }
                                    MethodButton(title: "Debit Account", active: method == "debitAccount", id: "tgBank.withdraw.method.debitAccount") { method = "debitAccount" }
                                }
                            }

                            VStack(alignment: .leading, spacing: 4) {
                                Text("Amount to Withdraw (USD)").font(.caption).foregroundColor(.secondary)
                                TextField("0.00", text: $amountString)
                                    .padding()
                                    .background(Color(uiColor: .systemBackground))
                                    .cornerRadius(8)
                                    #if os(iOS)
                                    .keyboardType(.decimalPad)
                                    #endif
                                    .accessibilityIdentifier("tgBank.withdraw.amountField")
                            }

                            if let err = errorMessage {
                                Text(err)
                                    .font(.footnote)
                                    .foregroundColor(.red)
                                    .accessibilityIdentifier("tgBank.withdraw.errorMessage")
                            }

                            Button(action: handleWithdraw) {
                                Text("Authorize Cash Withdrawal")
                                    .font(.headline)
                                    .foregroundColor(.white)
                                    .frame(maxWidth: .infinity)
                                    .frame(height: 50)
                                    .background(Color.tgPink)
                                    .cornerRadius(10)
                            }
                            .accessibilityIdentifier("tgBank.withdraw.submitButton")
                        }
                        .padding()
                        .background(Color(uiColor: .secondarySystemGroupedBackground))
                        .cornerRadius(16)
                        .padding(.horizontal)
                        .accessibilityIdentifier("tgBank.withdraw.card")
                    }
                }
                .padding(.vertical)
            }
            .background(Color(uiColor: .systemGroupedBackground))
            .navigationTitle("Withdraw Money")
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Close") { dismiss() }
                }
            }
            .accessibilityIdentifier("tgBank.withdraw.screen")
        }
    }

    private func handleWithdraw() {
        guard let amt = Double(amountString), amt > 0 else {
            errorMessage = "Please enter a valid amount."
            return
        }
        if repository.testControls.forceInsufficientBalance || repository.user.balance < amt {
            errorMessage = "Insufficient demo balance."
            return
        }
        if repository.testControls.forceTransactionFailure {
            errorMessage = "Transaction failed: Simulated bank network rejection."
            return
        }

        repository.user.balance -= amt
        txId = "TGX202609230011"
        let tx = Transaction(
            id: txId,
            title: "Withdrawal",
            recipientOrMerchant: "\(method.uppercased()) Cash Withdrawal",
            amount: amt,
            isCredit: false,
            type: .atm,
            timestamp: "Sep 23, 2026, 12:15",
            category: "ATM",
            note: "Cash withdrawal at \(method)",
            referenceId: "WTH-\(Int.random(in: 100000...999999))"
        )
        repository.transactions.insert(tx, at: 0)
        isSuccess = true
    }
}

struct MethodButton: View {
    let title: String
    let active: Bool
    let id: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.caption2)
                .bold()
                .foregroundColor(active ? .white : .primary)
                .frame(maxWidth: .infinity)
                .frame(height: 38)
                .background(active ? Color.tgPink : Color(uiColor: .systemGray5))
                .cornerRadius(8)
        }
        .accessibilityIdentifier(id)
    }
}
