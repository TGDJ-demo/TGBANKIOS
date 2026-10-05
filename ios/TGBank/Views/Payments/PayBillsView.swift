import SwiftUI
#if canImport(UIKit)
import UIKit
#endif

public struct PayBillsView: View {
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var repository: BankRepository

    @State private var accountNum: String = ""
    @State private var amountString: String = ""
    @State private var biller: String = "Pacific Gas & Electric"
    @State private var errorMessage: String? = nil
    @State private var isSuccess: Bool = false

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
                                .foregroundColor(.green)

                            Text("Bill Payment Successful")
                                .font(.title2)
                                .bold()

                            Text("Paid to \(biller) for Account #\(accountNum)")
                                .font(.caption)
                                .foregroundColor(.secondary)

                            Button("Done") { dismiss() }
                                .font(.headline)
                                .foregroundColor(.white)
                                .frame(maxWidth: .infinity)
                                .frame(height: 48)
                                .background(Color.green)
                                .cornerRadius(10)
                        }
                        .padding()
                        .background(Color(uiColor: .secondarySystemGroupedBackground))
                        .cornerRadius(16)
                        .padding(.horizontal)
                        .accessibilityIdentifier("tgBank.payBills.successCard")
                    } else {
                        VStack(spacing: 16) {
                            VStack(alignment: .leading, spacing: 4) {
                                Text("Select Biller").font(.caption).foregroundColor(.secondary)
                                Picker("Biller", selection: $biller) {
                                    Text("Pacific Gas & Electric").tag("Pacific Gas & Electric")
                                    Text("AT&T Fiber Internet").tag("AT&T Fiber Internet")
                                    Text("City Water & Utility").tag("City Water & Utility")
                                    Text("Metropolitan Transit").tag("Metropolitan Transit")
                                }
                                .pickerStyle(.menu)
                            }

                            VStack(alignment: .leading, spacing: 4) {
                                Text("Account / Consumer Number").font(.caption).foregroundColor(.secondary)
                                TextField("e.g. 445-9921", text: $accountNum)
                                    .padding()
                                    .background(Color(uiColor: .systemBackground))
                                    .cornerRadius(8)
                                    .accessibilityIdentifier("tgBank.payBills.accountField")
                            }

                            VStack(alignment: .leading, spacing: 4) {
                                Text("Amount (USD)").font(.caption).foregroundColor(.secondary)
                                TextField("0.00", text: $amountString)
                                    .padding()
                                    .background(Color(uiColor: .systemBackground))
                                    .cornerRadius(8)
                                    #if os(iOS)
                                    .keyboardType(.decimalPad)
                                    #endif
                                    .accessibilityIdentifier("tgBank.payBills.amountField")
                            }

                            if let err = errorMessage {
                                Text(err)
                                    .font(.footnote)
                                    .foregroundColor(.red)
                                    .accessibilityIdentifier("tgBank.payBills.errorMessage")
                            }

                            Button(action: handlePayBill) {
                                Text("Pay Bill")
                                    .font(.headline)
                                    .foregroundColor(.white)
                                    .frame(maxWidth: .infinity)
                                    .frame(height: 50)
                                    .background(Color.indigo)
                                    .cornerRadius(10)
                            }
                            .accessibilityIdentifier("tgBank.payBills.submitButton")
                        }
                        .padding()
                        .background(Color(uiColor: .secondarySystemGroupedBackground))
                        .cornerRadius(16)
                        .padding(.horizontal)
                        .accessibilityIdentifier("tgBank.payBills.card")
                    }
                }
                .padding(.vertical)
            }
            .background(Color(uiColor: .systemGroupedBackground))
            .navigationTitle("Pay Utility Bills")
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Close") { dismiss() }
                }
            }
            .accessibilityIdentifier("tgBank.payBills.screen")
        }
    }

    private func handlePayBill() {
        guard !accountNum.isEmpty else {
            errorMessage = "Please enter consumer/account number."
            return
        }
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
        let tx = Transaction(
            id: "TGX202609230012",
            title: "Bill Payment",
            recipientOrMerchant: biller,
            amount: amt,
            isCredit: false,
            type: .billPay,
            timestamp: "Sep 23, 2026, 12:20",
            category: "Bills",
            note: "Account #\(accountNum)",
            referenceId: "BIL-\(Int.random(in: 100000...999999))"
        )
        repository.transactions.insert(tx, at: 0)
        isSuccess = true
    }
}
