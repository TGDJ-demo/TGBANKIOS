import SwiftUI
#if canImport(UIKit)
import UIKit
#endif

public struct AddMoneyView: View {
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var repository: BankRepository
    @EnvironmentObject var coordinator: NavigationCoordinator

    @State private var method: String = "Debit Card"
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
                                .foregroundColor(.teal)

                            Text("Funds Added Successfully")
                                .font(.title2)
                                .bold()
                                .accessibilityIdentifier("tgBank.addMoney.successTitle")

                            Text("Transaction ID: \(txId)")
                                .font(.caption)
                                .foregroundColor(.secondary)
                                .accessibilityIdentifier("tgBank.addMoney.transactionId")

                            HStack(spacing: 12) {
                                Button("Done") { dismiss() }
                                    .font(.headline)
                                    .foregroundColor(.white)
                                    .frame(maxWidth: .infinity)
                                    .frame(height: 48)
                                    .background(Color.teal)
                                    .cornerRadius(10)
                                    .accessibilityIdentifier("tgBank.addMoney.doneButton")

                                Button("View Transaction") {
                                    dismiss()
                                    coordinator.selectedTab = .transactions
                                }
                                .font(.headline)
                                .foregroundColor(.blue)
                                .frame(maxWidth: .infinity)
                                .frame(height: 48)
                                .background(Color.blue.opacity(0.12))
                                .cornerRadius(10)
                                .accessibilityIdentifier("tgBank.addMoney.viewTransactionButton")
                            }
                        }
                        .padding()
                        .background(Color(uiColor: .secondarySystemGroupedBackground))
                        .cornerRadius(16)
                        .padding(.horizontal)
                        .accessibilityIdentifier("tgBank.addMoney.successCard")
                    } else {
                        VStack(spacing: 16) {
                            VStack(alignment: .leading, spacing: 4) {
                                Text("Payment Method").font(.caption).foregroundColor(.secondary)
                                Picker("Method", selection: $method) {
                                    Text("Debit Card").tag("Debit Card")
                                    Text("Bank Transfer").tag("Bank Transfer")
                                }
                                .pickerStyle(.segmented)
                                .accessibilityIdentifier("tgBank.addMoney.methodPicker")
                            }

                            VStack(alignment: .leading, spacing: 4) {
                                Text("Amount to Add (USD)").font(.caption).foregroundColor(.secondary)
                                TextField("0.00", text: $amountString)
                                    .padding()
                                    .background(Color(uiColor: .systemBackground))
                                    .cornerRadius(8)
                                    #if os(iOS)
                                    .keyboardType(.decimalPad)
                                    #endif
                                    .accessibilityIdentifier("tgBank.addMoney.amountField")

                                HStack {
                                    Button("+$5,000") { amountString = "5000" }
                                        .font(.caption2).padding(6).background(Color(uiColor: .systemGray5)).cornerRadius(6)
                                        .accessibilityIdentifier("tgBank.addMoney.quickAmount.5000")
                                    Button("+$10,000") { amountString = "10000" }
                                        .font(.caption2).padding(6).background(Color(uiColor: .systemGray5)).cornerRadius(6)
                                        .accessibilityIdentifier("tgBank.addMoney.quickAmount.10000")
                                    Button("+$25,000") { amountString = "25000" }
                                        .font(.caption2).padding(6).background(Color(uiColor: .systemGray5)).cornerRadius(6)
                                        .accessibilityIdentifier("tgBank.addMoney.quickAmount.25000")
                                    Button("+$50,000") { amountString = "50000" }
                                        .font(.caption2).padding(6).background(Color(uiColor: .systemGray5)).cornerRadius(6)
                                        .accessibilityIdentifier("tgBank.addMoney.quickAmount.50000")
                                }
                            }

                            if let err = errorMessage {
                                Text(err)
                                    .font(.footnote)
                                    .foregroundColor(.red)
                                    .accessibilityIdentifier("tgBank.addMoney.errorMessage")
                            }

                            Button(action: handleAddMoney) {
                                Text("Load Funds into Account")
                                    .font(.headline)
                                    .foregroundColor(.white)
                                    .frame(maxWidth: .infinity)
                                    .frame(height: 50)
                                    .background(Color.teal)
                                    .cornerRadius(10)
                            }
                            .accessibilityIdentifier("tgBank.addMoney.submitButton")
                        }
                        .padding()
                        .background(Color(uiColor: .secondarySystemGroupedBackground))
                        .cornerRadius(16)
                        .padding(.horizontal)
                        .accessibilityIdentifier("tgBank.addMoney.card")
                    }
                }
                .padding(.vertical)
            }
            .background(Color(uiColor: .systemGroupedBackground))
            .navigationTitle("Add Money")
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Close") { dismiss() }
                }
            }
            .accessibilityIdentifier("tgBank.addMoney.screen")
        }
    }

    private func handleAddMoney() {
        guard let amt = Double(amountString), amt > 0 else {
            errorMessage = "Please enter a valid amount."
            return
        }
        errorMessage = nil

        repository.user.balance += amt
        txId = "TGX202609230010"
        let tx = Transaction(
            id: txId,
            title: "Deposit / Added Funds",
            recipientOrMerchant: "Deposit via \(method)",
            amount: amt,
            isCredit: true,
            type: .addMoney,
            timestamp: "Sep 23, 2026, 12:10",
            category: "Income",
            note: "Loaded funds via \(method)",
            referenceId: "DEP-\(Int.random(in: 100000...999999))"
        )
        repository.transactions.insert(tx, at: 0)
        isSuccess = true
    }
}
