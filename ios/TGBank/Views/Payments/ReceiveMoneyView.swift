import SwiftUI
#if canImport(UIKit)
import UIKit
#endif

public struct ReceiveMoneyView: View {
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var repository: BankRepository

    @State private var shareAlert: Bool = false

    public init() {}

    public var body: some View {
        NavigationStack {
            VStack(spacing: 24) {
                VStack(spacing: 16) {
                    // QR Code Frame
                    ZStack {
                        RoundedRectangle(cornerRadius: 16)
                            .fill(Color.white)
                            .frame(width: 220, height: 220)
                            .shadow(color: Color.black.opacity(0.08), radius: 8)

                        VStack(spacing: 8) {
                            Image(systemName: "qrcode")
                                .resizable()
                                .scaledToFit()
                                .frame(width: 160, height: 160)
                                .foregroundColor(.black)

                            Text("SCAN TO PAY SANJAY G")
                                .font(.system(size: 9, weight: .bold))
                                .foregroundColor(.secondary)
                        }
                    }
                    .padding(.top, 8)
                    .accessibilityIdentifier("tgBank.receive.qrFrame")

                    VStack(spacing: 8) {
                        Text(repository.user.name)
                            .font(.title3)
                            .bold()
                            .accessibilityIdentifier("tgBank.receive.userName")

                        HStack {
                            Text("UPI ID:")
                                .font(.caption)
                                .foregroundColor(.secondary)
                            Text(repository.user.upiId)
                                .font(.caption)
                                .bold()
                                .foregroundColor(.purple)
                        }
                        .accessibilityIdentifier("tgBank.receive.upiId")

                        HStack {
                            Text("Account:")
                                .font(.caption)
                                .foregroundColor(.secondary)
                            Text(repository.user.accountNumber)
                                .font(.caption)
                                .bold()
                        }
                        .accessibilityIdentifier("tgBank.receive.accountNumber")

                        HStack {
                            Text("IFSC Code:")
                                .font(.caption)
                                .foregroundColor(.secondary)
                            Text(repository.user.ifsc)
                                .font(.caption)
                                .bold()
                        }
                        .accessibilityIdentifier("tgBank.receive.ifsc")
                    }

                    Button(action: {
                        UIPasteboard.general.string = "\(repository.user.name)\nAccount: \(repository.user.rawAccountNumber)\nIFSC: \(repository.user.ifsc)\nUPI: \(repository.user.upiId)"
                        shareAlert = true
                    }) {
                        HStack {
                            Image(systemName: "square.and.arrow.up")
                            Text("Share Bank & UPI Details")
                        }
                        .font(.headline)
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .frame(height: 48)
                        .background(Color.green)
                        .cornerRadius(10)
                    }
                    .accessibilityIdentifier("tgBank.receive.shareDetailsButton")
                }
                .padding()
                .background(Color(uiColor: .secondarySystemGroupedBackground))
                .cornerRadius(16)
                .padding(.horizontal)
                .accessibilityIdentifier("tgBank.receive.card")

                Spacer()
            }
            .padding(.top)
            .background(Color(uiColor: .systemGroupedBackground))
            .navigationTitle("Receive Money")
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Close") { dismiss() }
                }
            }
            .alert("Details Copied", isPresented: $shareAlert) {
                Button("OK", role: .cancel) {}
            } message: {
                Text("Your banking and UPI details were copied to clipboard.")
            }
            .accessibilityIdentifier("tgBank.receive.screen")
        }
    }
}
