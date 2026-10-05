import SwiftUI
#if canImport(UIKit)
import UIKit
#endif

public struct HomeView: View {
    @EnvironmentObject var repository: BankRepository
    @EnvironmentObject var coordinator: NavigationCoordinator
    @State private var copiedNotice: Bool = false

    public init() {}

    public var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                // Top Header info
                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        HStack(spacing: 6) {
                            Text("Welcome back,")
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                                .accessibilityIdentifier("tgBank.home.welcomeText")
                            
                            HStack(spacing: 4) {
                                Circle()
                                    .fill(Color.green)
                                    .frame(width: 8, height: 8)
                                Text("Online")
                                    .font(.caption2)
                                    .foregroundColor(.green)
                            }
                            .accessibilityIdentifier("tgBank.home.onlineStatus")
                        }

                        Text(repository.user.name)
                            .font(.title2)
                            .bold()
                            .accessibilityIdentifier("tgBank.home.userName")
                    }

                    Spacer()

                    // Relationship badge
                    VStack(alignment: .trailing, spacing: 2) {
                        Text(repository.user.tier)
                            .font(.caption2)
                            .bold()
                            .padding(.horizontal, 8)
                            .padding(.vertical, 3)
                            .background(Color.blue.opacity(0.15))
                            .foregroundColor(.blue)
                            .cornerRadius(6)

                        Text("Checking Account • 4588")
                            .font(.caption2)
                            .foregroundColor(.secondary)
                    }
                }
                .padding(.horizontal)

                // Main Balance Card
                VStack(alignment: .leading, spacing: 14) {
                    HStack {
                        Text("Total Available Balance")
                            .font(.caption)
                            .foregroundColor(.secondary)

                        Spacer()

                        Button(action: {
                            repository.isBalanceVisible.toggle()
                        }) {
                            Image(systemName: repository.isBalanceVisible ? "eye.fill" : "eye.slash.fill")
                                .foregroundColor(.secondary)
                        }
                        .accessibilityIdentifier("tgBank.home.balanceVisibilityButton")
                    }

                    HStack(alignment: .firstTextBaseline) {
                        if repository.isBalanceVisible {
                            Text(String(format: "$%.2f", repository.user.balance))
                                .font(.system(size: 32, weight: .bold, design: .rounded))
                                .accessibilityIdentifier("tgBank.home.accountBalance")
                                .accessibilityLabel("Total available balance")
                                .accessibilityValue(String(format: "$%.2f", repository.user.balance))
                        } else {
                            Text("$••••••••••")
                                .font(.system(size: 32, weight: .bold, design: .rounded))
                                .accessibilityIdentifier("tgBank.home.accountBalance")
                        }
                    }

                    Divider()

                    HStack {
                        VStack(alignment: .leading, spacing: 2) {
                            Text("Account Number")
                                .font(.caption2)
                                .foregroundColor(.secondary)
                            Text(repository.user.accountNumber)
                                .font(.footnote)
                                .bold()
                                .accessibilityIdentifier("tgBank.home.accountNumber")
                        }

                        Spacer()

                        Button(action: {
                            UIPasteboard.general.string = repository.user.rawAccountNumber
                            copiedNotice = true
                            DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
                                copiedNotice = false
                            }
                        }) {
                            HStack(spacing: 4) {
                                Image(systemName: copiedNotice ? "checkmark" : "doc.on.doc")
                                Text(copiedNotice ? "Copied" : "Copy")
                                    .font(.caption2)
                            }
                            .padding(.horizontal, 10)
                            .padding(.vertical, 5)
                            .background(Color(uiColor: .systemGray5))
                            .cornerRadius(8)
                        }
                        .accessibilityIdentifier("tgBank.home.copyAccountNumberButton")
                    }
                }
                .padding()
                .background(Color(uiColor: .secondarySystemGroupedBackground))
                .cornerRadius(16)
                .shadow(color: Color.black.opacity(0.04), radius: 8, x: 0, y: 2)
                .padding(.horizontal)
                .accessibilityIdentifier("tgBank.home.accountBalanceCard")

                // Quick Actions Grid (8 Actions)
                VStack(alignment: .leading, spacing: 12) {
                    Text("Quick Actions")
                        .font(.headline)
                        .padding(.horizontal)
                        .accessibilityIdentifier("tgBank.home.quickActionsHeader")

                    LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 12), count: 4), spacing: 12) {
                        QuickActionButton(
                            title: "Send",
                            icon: "paperplane.fill",
                            color: .blue,
                            identifier: "tgBank.home.sendMoneyButton"
                        ) {
                            coordinator.isShowingSendMoney = true
                        }

                        QuickActionButton(
                            title: "Receive",
                            icon: "arrow.down.left",
                            color: .green,
                            identifier: "tgBank.home.receiveMoneyButton"
                        ) {
                            coordinator.isShowingReceiveMoney = true
                        }

                        QuickActionButton(
                            title: "UPI Pay",
                            icon: "qrcode.viewfinder",
                            color: .purple,
                            identifier: "tgBank.home.upiPayButton"
                        ) {
                            coordinator.selectedTab = .payments
                        }

                        QuickActionButton(
                            title: "Add Money",
                            icon: "plus.circle.fill",
                            color: .teal,
                            identifier: "tgBank.home.addMoneyButton"
                        ) {
                            coordinator.isShowingAddMoney = true
                        }

                        QuickActionButton(
                            title: "Withdraw",
                            icon: "banknote.fill",
                            color: .orange,
                            identifier: "tgBank.home.withdrawButton"
                        ) {
                            coordinator.isShowingWithdraw = true
                        }

                        QuickActionButton(
                            title: "Pay Bills",
                            icon: "doc.text.fill",
                            color: .indigo,
                            identifier: "tgBank.home.payBillsButton"
                        ) {
                            coordinator.isShowingPayBills = true
                        }

                        QuickActionButton(
                            title: "Credit",
                            icon: "creditcard.fill",
                            color: .pink,
                            identifier: "tgBank.home.creditButton"
                        ) {
                            coordinator.selectedTab = .credit
                        }

                        QuickActionButton(
                            title: "KYC",
                            icon: "person.badge.shield.checkmark.fill",
                            color: repository.user.kycStatus == .verified ? .green : .red,
                            identifier: "tgBank.home.kycButton"
                        ) {
                            coordinator.isShowingKYCWizard = true
                        }
                    }
                    .padding(.horizontal)
                }

                // Spending Summary Card
                VStack(alignment: .leading, spacing: 12) {
                    HStack {
                        VStack(alignment: .leading, spacing: 2) {
                            Text("September 2026 Spending Summary")
                                .font(.caption)
                                .foregroundColor(.secondary)
                            Text("$1,675.68")
                                .font(.title3)
                                .bold()
                                .accessibilityIdentifier("tgBank.home.spendingSummary.total")
                        }
                        Spacer()
                    }

                    VStack(spacing: 8) {
                        SpendingRow(name: "Shopping", amount: "$856.99", pct: "35%", color: .blue, identifier: "tgBank.home.spendingSummary.shopping")
                        SpendingRow(name: "Food", amount: "$245.50", pct: "18%", color: .orange, identifier: "tgBank.home.spendingSummary.food")
                        SpendingRow(name: "Bills", amount: "$360.70", pct: "22%", color: .purple, identifier: "tgBank.home.spendingSummary.bills")
                        SpendingRow(name: "Transfers", amount: "$212.50", pct: "15%", color: .green, identifier: "tgBank.home.spendingSummary.transfers")
                        SpendingRow(name: "Entertainment", amount: "$99.99", pct: "10%", color: .pink, identifier: "tgBank.home.spendingSummary.entertainment")
                    }
                }
                .padding()
                .background(Color(uiColor: .secondarySystemGroupedBackground))
                .cornerRadius(16)
                .shadow(color: Color.black.opacity(0.04), radius: 8, x: 0, y: 2)
                .padding(.horizontal)
                .accessibilityIdentifier("tgBank.home.spendingSummaryCard")

                // Recent Transactions
                VStack(alignment: .leading, spacing: 12) {
                    HStack {
                        Text("Recent Transactions")
                            .font(.headline)
                            .accessibilityIdentifier("tgBank.home.recentTransactions")

                        Spacer()

                        Button(action: {
                            coordinator.selectedTab = .transactions
                        }) {
                            Text("View All")
                                .font(.caption)
                                .bold()
                                .foregroundColor(.blue)
                        }
                        .accessibilityIdentifier("tgBank.home.viewAllTransactionsButton")
                    }
                    .padding(.horizontal)

                    VStack(spacing: 1) {
                        ForEach(repository.transactions.prefix(4)) { tx in
                            TransactionRowView(tx: tx) {
                                coordinator.selectedTransaction = tx
                            }
                        }
                    }
                    .background(Color(uiColor: .secondarySystemGroupedBackground))
                    .cornerRadius(16)
                    .padding(.horizontal)
                }

                Spacer().frame(height: 24)
            }
        }
        .background(Color(uiColor: .systemGroupedBackground))
        .navigationTitle("TG Bank")
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                HStack(spacing: 12) {
                    Button(action: { coordinator.isShowingNotifications = true }) {
                        Image(systemName: "bell.fill")
                    }
                    .accessibilityIdentifier("tgBank.navigation.notificationButton")

                    Button(action: { coordinator.isShowingTestControls = true }) {
                        Image(systemName: "slider.horizontal.3")
                    }
                    .accessibilityIdentifier("tgBank.navigation.testControlsButton")

                    Button(action: {
                        if repository.selectedTheme == .light {
                            repository.selectedTheme = .dark
                        } else {
                            repository.selectedTheme = .light
                        }
                    }) {
                        Image(systemName: repository.selectedTheme == .dark ? "sun.max.fill" : "moon.fill")
                    }
                    .accessibilityIdentifier("tgBank.navigation.themeToggleButton")
                }
            }
        }
        .sheet(isPresented: $coordinator.isShowingNotifications) {
            NotificationsView()
        }
        .sheet(isPresented: $coordinator.isShowingTestControls) {
            TestControlsView()
        }
        .sheet(isPresented: $coordinator.isShowingSendMoney) {
            SendMoneyView()
        }
        .accessibilityIdentifier("tgBank.home.screen")
    }
}

struct QuickActionButton: View {
    let title: String
    let icon: String
    let color: Color
    let identifier: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: 8) {
                ZStack {
                    Circle()
                        .fill(color.opacity(0.12))
                        .frame(width: 48, height: 48)
                    Image(systemName: icon)
                        .font(.system(size: 20))
                        .foregroundColor(color)
                }
                Text(title)
                    .font(.caption2)
                    .fontWeight(.medium)
                    .foregroundColor(.primary)
                    .lineLimit(1)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 8)
            .background(Color(uiColor: .secondarySystemGroupedBackground))
            .cornerRadius(12)
        }
        .accessibilityIdentifier(identifier)
    }
}

struct SpendingRow: View {
    let name: String
    let amount: String
    let pct: String
    let color: Color
    let identifier: String

    var body: some View {
        HStack {
            Circle()
                .fill(color)
                .frame(width: 8, height: 8)
            Text(name)
                .font(.caption)
                .foregroundColor(.secondary)
            Spacer()
            Text(amount)
                .font(.caption)
                .bold()
            Text(pct)
                .font(.caption2)
                .foregroundColor(.secondary)
                .frame(width: 36, alignment: .trailing)
        }
        .accessibilityIdentifier(identifier)
    }
}

struct TransactionRowView: View {
    let tx: Transaction
    let onTap: () -> Void

    var body: some View {
        Button(action: onTap) {
            HStack(spacing: 12) {
                ZStack {
                    Circle()
                        .fill(tx.isCredit ? Color.green.opacity(0.12) : Color.blue.opacity(0.12))
                        .frame(width: 40, height: 40)
                    Image(systemName: tx.isCredit ? "arrow.down.left" : "arrow.up.right")
                        .font(.system(size: 16))
                        .foregroundColor(tx.isCredit ? .green : .blue)
                }

                VStack(alignment: .leading, spacing: 2) {
                    Text(tx.title)
                        .font(.subheadline)
                        .fontWeight(.semibold)
                        .foregroundColor(.primary)
                    Text(tx.recipientOrMerchant)
                        .font(.caption)
                        .foregroundColor(.secondary)
                }

                Spacer()

                VStack(alignment: .trailing, spacing: 2) {
                    Text((tx.isCredit ? "+$" : "-$") + String(format: "%.2f", tx.amount))
                        .font(.subheadline)
                        .fontWeight(.bold)
                        .foregroundColor(tx.isCredit ? .green : .primary)
                    Text(tx.timestamp)
                        .font(.caption2)
                        .foregroundColor(.secondary)
                }
            }
            .padding(.horizontal, 14)
            .padding(.vertical, 12)
        }
        .accessibilityIdentifier("tgBank.transactions.item.\(tx.id)")
    }
}
