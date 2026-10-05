import SwiftUI
#if canImport(UIKit)
import UIKit
#endif

public struct TransactionsListView: View {
    @EnvironmentObject var repository: BankRepository
    @EnvironmentObject var coordinator: NavigationCoordinator

    @State private var searchText: String = ""
    @State private var filterMode: String = "ALL" // ALL, CREDITS, DEBITS, UPI, CARD, IMPS, etc.

    public init() {}

    private var filteredTransactions: [Transaction] {
        repository.transactions.filter { tx in
            // Search text
            let matchesSearch = searchText.isEmpty ||
                tx.title.localizedCaseInsensitiveContains(searchText) ||
                tx.recipientOrMerchant.localizedCaseInsensitiveContains(searchText) ||
                tx.id.localizedCaseInsensitiveContains(searchText) ||
                tx.category.localizedCaseInsensitiveContains(searchText)

            if !matchesSearch { return false }

            // Filter
            if filterMode == "ALL" { return true }
            if filterMode == "CREDITS" { return tx.isCredit }
            if filterMode == "DEBITS" { return !tx.isCredit }
            if filterMode == "UPI" { return tx.type == .upi }
            if filterMode == "CARD" { return tx.type == .card }
            if filterMode == "ATM" { return tx.type == .atm }
            if filterMode == "SALARY" { return tx.type == .salary }
            if filterMode == "ADD_MONEY" { return tx.type == .addMoney }
            if filterMode == "BILL_PAY" { return tx.type == .billPay }
            if filterMode == "CREDIT_PAY" { return tx.type == .creditPay }
            if filterMode == "IMPS" { return tx.type == .imps }
            if filterMode == "NEFT" { return tx.type == .neft }
            if filterMode == "ACH" { return tx.type == .ach }
            if filterMode == "RTGS" { return tx.type == .rtgs }
            return true
        }
    }

    public var body: some View {
        VStack(spacing: 0) {
            // Search Bar
            HStack {
                HStack {
                    Image(systemName: "magnifyingglass")
                        .foregroundColor(.secondary)
                    TextField("Search transactions, merchants, IDs", text: $searchText)
                        .accessibilityIdentifier("tgBank.transactions.searchField")

                    if !searchText.isEmpty {
                        Button(action: { searchText = "" }) {
                            Image(systemName: "xmark.circle.fill")
                                .foregroundColor(.secondary)
                        }
                        .accessibilityIdentifier("tgBank.transactions.clearSearchButton")
                    }
                }
                .padding(8)
                .background(Color(uiColor: .secondarySystemGroupedBackground))
                .cornerRadius(10)
            }
            .padding(.horizontal)
            .padding(.top, 8)

            // Horizontal Filter Chips
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    FilterChip(title: "All", active: filterMode == "ALL", id: "tgBank.transactions.filter.all") { filterMode = "ALL" }
                    FilterChip(title: "Credits (+)", active: filterMode == "CREDITS", id: "tgBank.transactions.filter.credits") { filterMode = "CREDITS" }
                    FilterChip(title: "Debits (-)", active: filterMode == "DEBITS", id: "tgBank.transactions.filter.debits") { filterMode = "DEBITS" }
                    FilterChip(title: "UPI", active: filterMode == "UPI", id: "tgBank.transactions.filter.upi") { filterMode = "UPI" }
                    FilterChip(title: "Card", active: filterMode == "CARD", id: "tgBank.transactions.filter.card") { filterMode = "CARD" }
                    FilterChip(title: "ATM", active: filterMode == "ATM", id: "tgBank.transactions.filter.atm") { filterMode = "ATM" }
                    FilterChip(title: "Salary", active: filterMode == "SALARY", id: "tgBank.transactions.filter.salary") { filterMode = "SALARY" }
                    FilterChip(title: "IMPS", active: filterMode == "IMPS", id: "tgBank.transactions.filter.imps") { filterMode = "IMPS" }
                    FilterChip(title: "NEFT", active: filterMode == "NEFT", id: "tgBank.transactions.filter.neft") { filterMode = "NEFT" }
                    FilterChip(title: "ACH", active: filterMode == "ACH", id: "tgBank.transactions.filter.ach") { filterMode = "ACH" }
                    FilterChip(title: "RTGS", active: filterMode == "RTGS", id: "tgBank.transactions.filter.rtgs") { filterMode = "RTGS" }
                    FilterChip(title: "Bill Pay", active: filterMode == "BILL_PAY", id: "tgBank.transactions.filter.billPay") { filterMode = "BILL_PAY" }
                }
                .padding(.horizontal)
                .padding(.vertical, 10)
            }

            // Count header
            HStack {
                Text("\(filteredTransactions.count) Transactions")
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .accessibilityIdentifier("tgBank.transactions.count")
                Spacer()
            }
            .padding(.horizontal)
            .padding(.bottom, 4)

            // Transactions List
            if filteredTransactions.isEmpty {
                VStack(spacing: 12) {
                    Spacer().frame(height: 60)
                    Image(systemName: "tray")
                        .font(.system(size: 48))
                        .foregroundColor(.secondary)
                    Text("No transactions found")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                    Spacer()
                }
                .accessibilityIdentifier("tgBank.transactions.emptyState")
            } else {
                List {
                    ForEach(filteredTransactions) { tx in
                        TransactionRowView(tx: tx) {
                            coordinator.selectedTransaction = tx
                        }
                        .listRowInsets(EdgeInsets(top: 4, leading: 16, bottom: 4, trailing: 16))
                        .listRowBackground(Color.clear)
                        .listRowSeparator(.hidden)
                    }
                }
                .listStyle(.plain)
            }
        }
        .background(Color(uiColor: .systemGroupedBackground))
        .navigationTitle("History")
        .sheet(item: $coordinator.selectedTransaction) { tx in
            TransactionDetailView(tx: tx)
        }
        .accessibilityIdentifier("tgBank.transactions.screen")
    }
}

struct FilterChip: View {
    let title: String
    let active: Bool
    let id: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.caption2)
                .bold()
                .padding(.horizontal, 12)
                .padding(.vertical, 6)
                .background(active ? Color.blue : Color(uiColor: .secondarySystemGroupedBackground))
                .foregroundColor(active ? .white : .primary)
                .cornerRadius(14)
        }
        .accessibilityIdentifier(id)
    }
}
