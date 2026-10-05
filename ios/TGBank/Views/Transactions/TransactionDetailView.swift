import SwiftUI
#if canImport(UIKit)
import UIKit
#endif

public struct TransactionDetailView: View {
    @Environment(\.dismiss) var dismiss
    public let tx: Transaction

    @State private var receiptDownloaded: Bool = false

    public init(tx: Transaction) {
        self.tx = tx
    }

    public var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    VStack(spacing: 12) {
                        ZStack {
                            Circle()
                                .fill(tx.isCredit ? Color.green.opacity(0.12) : Color.blue.opacity(0.12))
                                .frame(width: 64, height: 64)
                            Image(systemName: tx.isCredit ? "arrow.down.left" : "arrow.up.right")
                                .font(.title2)
                                .foregroundColor(tx.isCredit ? .green : .blue)
                        }

                        Text(tx.title)
                            .font(.title3)
                            .bold()
                            .accessibilityIdentifier("tgBank.transactionDetail.title")

                        Text((tx.isCredit ? "+$" : "-$") + String(format: "%.2f", tx.amount))
                            .font(.system(size: 36, weight: .bold))
                            .foregroundColor(tx.isCredit ? .green : .primary)
                            .accessibilityIdentifier("tgBank.transactionDetail.amount")

                        Text(tx.status)
                            .font(.caption)
                            .bold()
                            .padding(.horizontal, 10)
                            .padding(.vertical, 4)
                            .background(Color.green.opacity(0.15))
                            .foregroundColor(.green)
                            .cornerRadius(8)
                            .accessibilityIdentifier("tgBank.transactionDetail.status")
                    }
                    .padding(.top, 10)

                    VStack(spacing: 14) {
                        DetailRow(label: "Transaction ID", value: tx.id, id: "tgBank.transactionDetail.transactionId")
                        DetailRow(label: "Recipient / Merchant", value: tx.recipientOrMerchant, id: "tgBank.transactionDetail.recipient")
                        DetailRow(label: "Category", value: tx.category, id: "tgBank.transactionDetail.category")
                        DetailRow(label: "Timestamp", value: tx.timestamp, id: "tgBank.transactionDetail.timestamp")
                        DetailRow(label: "Note / Memo", value: tx.note, id: "tgBank.transactionDetail.note")
                        DetailRow(label: "Transfer Rail", value: tx.rail ?? tx.type.rawValue, id: "tgBank.transactionDetail.rail")
                        DetailRow(label: "Reference Number", value: tx.referenceId, id: "tgBank.transactionDetail.referenceId")
                    }
                    .padding()
                    .background(Color(uiColor: .secondarySystemGroupedBackground))
                    .cornerRadius(16)
                    .padding(.horizontal)

                    Button(action: {
                        receiptDownloaded = true
                    }) {
                        HStack {
                            Image(systemName: receiptDownloaded ? "checkmark" : "arrow.down.doc.fill")
                            Text(receiptDownloaded ? "Receipt Downloaded (PDF)" : "Download PDF Receipt")
                        }
                        .font(.headline)
                        .foregroundColor(.blue)
                        .frame(maxWidth: .infinity)
                        .frame(height: 50)
                        .background(Color.blue.opacity(0.12))
                        .cornerRadius(10)
                    }
                    .padding(.horizontal)
                    .accessibilityIdentifier("tgBank.transactionDetail.downloadReceiptButton")
                }
                .padding(.bottom, 24)
            }
            .background(Color(uiColor: .systemGroupedBackground))
            .navigationTitle("Transaction Details")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button(action: { dismiss() }) {
                        Image(systemName: "chevron.left")
                        Text("Back")
                    }
                    .accessibilityIdentifier("tgBank.transactionDetail.backButton")
                }
            }
            .accessibilityIdentifier("tgBank.transactionDetail.screen")
        }
    }
}

struct DetailRow: View {
    let label: String
    let value: String
    let id: String

    var body: some View {
        HStack {
            Text(label)
                .font(.caption)
                .foregroundColor(.secondary)
            Spacer()
            Text(value)
                .font(.caption)
                .bold()
                .foregroundColor(.primary)
                .multilineTextAlignment(.trailing)
        }
        .accessibilityIdentifier(id)
    }
}
