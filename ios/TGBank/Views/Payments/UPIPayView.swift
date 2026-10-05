import SwiftUI
#if canImport(UIKit)
import UIKit
#endif
import AVFoundation

public struct UPIPayView: View {
    @EnvironmentObject var repository: BankRepository
    @EnvironmentObject var coordinator: NavigationCoordinator

    @State private var activeTab: String = "payId" // payId, scanPay, sendContact, history
    @State private var upiId: String = ""
    @State private var amountString: String = ""
    @State private var message: String = ""
    @State private var merchantName: String = ""
    @State private var errorMessage: String? = nil

    // Success State
    @State private var isSuccess: Bool = false
    @State private var successTxId: String = ""
    @State private var successAmount: Double = 0.0
    @State private var successVpa: String = ""
    @State private var successMerchant: String = ""
    @State private var successTimestamp: String = ""

    // QR Scanner
    @State private var isShowingScanner: Bool = false

    public init() {}

    public var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                // Tab Picker
                HStack(spacing: 0) {
                    TabButton(title: "UPI ID", active: activeTab == "payId", id: "tgBank.upi.payIdTab") { activeTab = "payId" }
                    TabButton(title: "Scan QR", active: activeTab == "scanPay", id: "tgBank.upi.scanPayTab") { isShowingScanner = true }
                    TabButton(title: "Contact", active: activeTab == "sendContact", id: "tgBank.upi.sendContactTab") { activeTab = "sendContact" }
                    TabButton(title: "History", active: activeTab == "history", id: "tgBank.upi.historyTab") { coordinator.selectedTab = .transactions }
                }
                .padding(4)
                .background(Color(uiColor: .secondarySystemGroupedBackground))
                .cornerRadius(10)
                .padding(.horizontal)

                if isSuccess {
                    successCardView
                } else {
                    payIdCardView
                }
            }
            .padding(.vertical)
        }
        .background(Color(uiColor: .systemGroupedBackground))
        .navigationTitle("UPI & Pay")
        .sheet(isPresented: $isShowingScanner) {
            QRScannerView(onScanned: { scannedVpa, merchant, amount in
                upiId = scannedVpa
                merchantName = merchant
                amountString = String(format: "%.2f", amount)
                isShowingScanner = false
            })
        }
        .accessibilityIdentifier("tgBank.upi.screen")
    }

    private var payIdCardView: some View {
        VStack(spacing: 16) {
            // Demo shortcuts
            VStack(alignment: .leading, spacing: 8) {
                Text("Demo Fast Pay / Quick Presets")
                    .font(.caption)
                    .foregroundColor(.secondary)

                HStack(spacing: 8) {
                    DemoMerchantButton(title: "Demo Store", vpa: "merchant@tg", amt: 125.0, id: "tgBank.upi.demoMerchant1") {
                        setDemoMerchant(vpa: "merchant@tg", name: "TG Demo Store", amt: 125.0)
                    }
                    DemoMerchantButton(title: "Coffee", vpa: "coffee@tg", amt: 14.50, id: "tgBank.upi.demoMerchant2") {
                        setDemoMerchant(vpa: "coffee@tg", name: "Starbucks Store #301", amt: 14.50)
                    }
                    DemoMerchantButton(title: "TechGrid Cloud", vpa: "cloud@tg", amt: 499.0, id: "tgBank.upi.demoMerchant3") {
                        setDemoMerchant(vpa: "cloud@tg", name: "TechGrid Enterprise", amt: 499.0)
                    }
                }
            }

            VStack(spacing: 12) {
                VStack(alignment: .leading, spacing: 4) {
                    Text("UPI ID / VPA").font(.caption).foregroundColor(.secondary)
                    TextField("e.g. merchant@tg", text: $upiId)
                        .padding()
                        .background(Color(uiColor: .systemBackground))
                        .cornerRadius(8)
                        .autocapitalization(.none)
                        .accessibilityIdentifier("tgBank.upi.idField")
                }

                if !merchantName.isEmpty {
                    HStack {
                        Image(systemName: "checkmark.seal.fill").foregroundColor(.blue)
                        Text(merchantName).font(.caption).bold().foregroundColor(.blue)
                        Spacer()
                    }
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
                        .accessibilityIdentifier("tgBank.upi.amountField")
                }

                VStack(alignment: .leading, spacing: 4) {
                    Text("Message / Note").font(.caption).foregroundColor(.secondary)
                    TextField("e.g. Coffee or Dinner", text: $message)
                        .padding()
                        .background(Color(uiColor: .systemBackground))
                        .cornerRadius(8)
                        .accessibilityIdentifier("tgBank.upi.messageField")
                }

                if let err = errorMessage {
                    Text(err)
                        .font(.footnote)
                        .foregroundColor(.red)
                        .accessibilityIdentifier("tgBank.upi.errorMessage")
                }

                Button(action: handleUPIPayment) {
                    Text("Pay Securely via UPI")
                        .font(.headline)
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .frame(height: 50)
                        .background(Color.purple)
                        .cornerRadius(10)
                }
                .accessibilityIdentifier("tgBank.upi.payButton")

                Button(action: {
                    setDemoMerchant(vpa: "merchant@tg", name: "TG Demo Store", amt: 125.0)
                }) {
                    HStack {
                        Image(systemName: "qrcode")
                        Text("Simulate Demo QR Payment ($125.00)")
                    }
                    .font(.subheadline)
                    .foregroundColor(.purple)
                }
                .padding(.top, 4)
                .accessibilityIdentifier("tgBank.upi.demoQrButton")
            }
            .padding()
            .background(Color(uiColor: .secondarySystemGroupedBackground))
            .cornerRadius(16)
            .accessibilityIdentifier("tgBank.upi.payIdCard")
        }
        .padding(.horizontal)
    }

    private var successCardView: some View {
        VStack(spacing: 20) {
            Image(systemName: "checkmark.circle.fill")
                .resizable()
                .frame(width: 64, height: 64)
                .foregroundColor(.green)

            Text("Payment Successful")
                .font(.title2)
                .bold()
                .accessibilityIdentifier("tgBank.upi.successTitle")

            Text("$\(successAmount, specifier: "%.2f")")
                .font(.system(size: 36, weight: .bold))
                .accessibilityIdentifier("tgBank.upi.successAmount")

            VStack(spacing: 8) {
                HStack {
                    Text("Paid to").font(.caption).foregroundColor(.secondary)
                    Spacer()
                    Text(successMerchant).font(.caption).bold()
                }
                .accessibilityIdentifier("tgBank.upi.successMerchant")

                HStack {
                    Text("UPI ID").font(.caption).foregroundColor(.secondary)
                    Spacer()
                    Text(successVpa).font(.caption).bold()
                }
                .accessibilityIdentifier("tgBank.upi.successVpa")

                HStack {
                    Text("Timestamp").font(.caption).foregroundColor(.secondary)
                    Spacer()
                    Text(successTimestamp).font(.caption)
                }
                .accessibilityIdentifier("tgBank.upi.successTimestamp")

                HStack {
                    Text("Transaction ID").font(.caption).foregroundColor(.secondary)
                    Spacer()
                    Text(successTxId).font(.caption).bold()
                }
                .accessibilityIdentifier("tgBank.upi.successTransactionId")

                HStack {
                    Text("Status").font(.caption).foregroundColor(.secondary)
                    Spacer()
                    Text("COMPLETED").font(.caption).bold().foregroundColor(.green)
                }
                .accessibilityIdentifier("tgBank.upi.successStatus")
            }
            .padding()
            .background(Color(uiColor: .systemBackground))
            .cornerRadius(12)

            HStack(spacing: 12) {
                Button("Done") {
                    isSuccess = false
                    upiId = ""
                    amountString = ""
                    message = ""
                    merchantName = ""
                }
                .font(.headline)
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .frame(height: 48)
                .background(Color.green)
                .cornerRadius(10)
                .accessibilityIdentifier("tgBank.upi.successDoneButton")

                Button("View Transaction") {
                    isSuccess = false
                    coordinator.selectedTab = .transactions
                }
                .font(.headline)
                .foregroundColor(.blue)
                .frame(maxWidth: .infinity)
                .frame(height: 48)
                .background(Color.blue.opacity(0.12))
                .cornerRadius(10)
                .accessibilityIdentifier("tgBank.upi.successViewTransactionButton")
            }
        }
        .padding()
        .background(Color(uiColor: .secondarySystemGroupedBackground))
        .cornerRadius(16)
        .padding(.horizontal)
        .accessibilityIdentifier("tgBank.upi.successCard")
    }

    private func setDemoMerchant(vpa: String, name: String, amt: Double) {
        upiId = vpa
        merchantName = name
        amountString = String(format: "%.2f", amt)
        message = "Demo Purchase"
    }

    private func handleUPIPayment() {
        guard !upiId.isEmpty else {
            errorMessage = "Please enter a valid UPI ID"
            return
        }
        guard let amt = Double(amountString), amt > 0 else {
            errorMessage = "Please enter a valid amount"
            return
        }
        errorMessage = nil

        let res = repository.upiPayment(
            vpa: upiId,
            merchant: merchantName,
            amount: amt,
            note: message
        )

        if res.success {
            successAmount = amt
            successVpa = upiId
            successMerchant = merchantName.isEmpty ? upiId : merchantName
            successTxId = res.txId ?? "TGX202609230009"
            successTimestamp = "Sep 23, 2026, 12:05"
            isSuccess = true
        } else {
            errorMessage = res.error ?? "UPI payment failed."
        }
    }
}

struct TabButton: View {
    let title: String
    let active: Bool
    let id: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.subheadline)
                .fontWeight(active ? .semibold : .regular)
                .foregroundColor(active ? .white : .secondary)
                .frame(maxWidth: .infinity)
                .frame(height: 36)
                .background(active ? Color.purple : Color.clear)
                .cornerRadius(8)
        }
        .accessibilityIdentifier(id)
    }
}

struct DemoMerchantButton: View {
    let title: String
    let vpa: String
    let amt: Double
    let id: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: 2) {
                Text(title).font(.caption2).bold().foregroundColor(.primary)
                Text("$\(amt, specifier: "%.2f")").font(.caption2).foregroundColor(.purple)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 8)
            .background(Color(uiColor: .systemBackground))
            .cornerRadius(8)
        }
        .accessibilityIdentifier(id)
    }
}
