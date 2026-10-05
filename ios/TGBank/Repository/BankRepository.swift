import Foundation
import SwiftUI
import Combine

public class BankRepository: ObservableObject {
    @Published public var user: UserProfile
    @Published public var transactions: [Transaction]
    @Published public var beneficiaries: [Beneficiary]
    @Published public var creditCards: [EliteCreditCard]
    @Published public var notifications: [NotificationItem]
    @Published public var testControls: TestControlState
    @Published public var isAuthenticated: Bool = false
    @Published public var isBalanceVisible: Bool = true
    @Published public var selectedLanguage: AppLanguage = .en
    @Published public var selectedTheme: AppThemeMode = .system
    
    public var colorScheme: ColorScheme? {
        switch selectedTheme {
        case .system: return nil
        case .light: return .light
        case .dark: return .dark
        }
    }

    private var transactionSeq = 8

    public init() {
        self.user = UserProfile(
            name: "Sanjay G",
            balance: 24588338510.70,
            accountNumber: "**** **** 4588",
            rawAccountNumber: "458890123456",
            accountType: "Ultra High Net Worth Private Banking",
            currency: "USD",
            creditScore: 850,
            creditRating: "World Elite / Exceptional",
            bankingScore: 998,
            creditLimit: 5000000.00,
            availableCredit: 4825000.00,
            usedCredit: 175000.00,
            nextPayment: 12500.00,
            paymentDue: "Oct 15, 2026",
            kycStatus: .verified,
            phone: "+1 (555) 019-4588",
            email: "sanjay.g@testgrid.demo",
            address: "458 Tech Park Blvd, Suite 200, San Jose, CA 95110",
            dob: "14 Aug 1988",
            ifsc: "TGBN0004588",
            upiId: "sanjay@tg",
            relationshipManager: "Priya Menon • Private Banking Desk",
            clientSince: "2012",
            tier: "Black Diamond Ultra"
        )

        self.beneficiaries = [
            Beneficiary(
                id: "BEN001",
                name: "Aarav Mehta",
                nickname: "Aarav",
                account: "998877665544",
                ifsc: "HDFC0001234",
                bank: "HDFC Bank",
                rail: .imps,
                isFavorite: true,
                isVerified: true
            ),
            Beneficiary(
                id: "BEN002",
                name: "Priya Sharma",
                nickname: "Priya",
                account: "112233445566",
                ifsc: "ICIC0005678",
                bank: "ICICI Bank",
                rail: .neft,
                isFavorite: true,
                isVerified: true
            ),
            Beneficiary(
                id: "BEN003",
                name: "Global Holdings LLC",
                nickname: "Global HQ",
                account: "445566778899",
                ifsc: "021000021",
                bank: "JPMorgan Chase",
                rail: .ach,
                isFavorite: false,
                isVerified: true
            ),
            Beneficiary(
                id: "BEN004",
                name: "Singapore Trust Co",
                nickname: "SG Trust",
                account: "778899001122",
                ifsc: "DBSSSGSGXXX",
                bank: "DBS Bank",
                rail: .rtgs,
                isFavorite: false,
                isVerified: true
            )
        ]

        self.transactions = [
            Transaction(
                id: "TGX202609160001",
                title: "Amazon",
                recipientOrMerchant: "Amazon.com Payments",
                amount: 249.99,
                isCredit: false,
                type: .card,
                timestamp: "Sep 16, 2026, 14:22",
                status: "Completed",
                category: "Shopping",
                note: "Electronics order #402-99128",
                referenceId: "REF-AMZ-991280"
            ),
            Transaction(
                id: "TGX202609160002",
                title: "Salary Credit",
                recipientOrMerchant: "TestGrid Technologies Inc",
                amount: 15000.00,
                isCredit: true,
                type: .salary,
                timestamp: "Sep 15, 2026, 09:00",
                status: "Completed",
                category: "Income",
                note: "Monthly Payroll Deposit",
                referenceId: "REF-PAY-20260915"
            ),
            Transaction(
                id: "TGX202609150003",
                title: "Starbucks",
                recipientOrMerchant: "Starbucks Coffee #301",
                amount: 18.45,
                isCredit: false,
                type: .card,
                timestamp: "Sep 15, 2026, 08:45",
                status: "Completed",
                category: "Food",
                note: "Breakfast & Espresso",
                referenceId: "REF-SBX-084511"
            ),
            Transaction(
                id: "TGX202609140004",
                title: "UPI Payment",
                recipientOrMerchant: "TG Demo Store",
                amount: 125.00,
                isCredit: false,
                type: .upi,
                timestamp: "Sep 14, 2026, 17:30",
                status: "Completed",
                category: "Shopping",
                note: "QR Payment at Store",
                rail: "UPI",
                referenceId: "UPI-DEMO-789012"
            ),
            Transaction(
                id: "TGX202609130005",
                title: "IMPS Transfer",
                recipientOrMerchant: "Aarav Mehta",
                amount: 250000.00,
                isCredit: false,
                type: .imps,
                timestamp: "Sep 13, 2026, 11:05",
                status: "Completed",
                category: "Transfers",
                note: "Family transfer",
                rail: "IMPS",
                referenceId: "REF-IMP-445889"
            ),
            Transaction(
                id: "TGX202609120006",
                title: "Electricity Bill",
                recipientOrMerchant: "Pacific Gas & Electric",
                amount: 186.40,
                isCredit: false,
                type: .billPay,
                timestamp: "Sep 12, 2026, 16:10",
                status: "Completed",
                category: "Bills",
                note: "Account 445-9921",
                referenceId: "REF-PGE-88129"
            ),
            Transaction(
                id: "TGX202609100007",
                title: "Dividend Credit",
                recipientOrMerchant: "Vanguard Index Fund",
                amount: 87500.00,
                isCredit: true,
                type: .salary,
                timestamp: "Sep 10, 2026, 08:00",
                status: "Completed",
                category: "Income",
                note: "Quarterly dividend",
                referenceId: "REF-VAN-100234"
            )
        ]

        self.creditCards = [
            EliteCreditCard(
                id: "CARD001",
                name: "TG Black Diamond Infinite",
                tier: "World Elite",
                cardNumber: "**** **** **** 8899",
                expiry: "12/30",
                holder: "SANJAY G",
                limit: 2500000.0,
                available: 2412500.0,
                used: 87500.0,
                perks: "Unlimited lounge + 5% cashback on travel"
            ),
            EliteCreditCard(
                id: "CARD002",
                name: "TG Invitation-Only Metal",
                tier: "Private Invitation",
                cardNumber: "**** **** **** 4588",
                expiry: "09/29",
                holder: "SANJAY G",
                limit: 2500000.0,
                available: 2412500.0,
                used: 87500.0,
                perks: "Concierge 24/7 + private jet credits"
            )
        ]

        self.notifications = [
            NotificationItem(
                id: "N1",
                title: "Transfer Successful",
                message: "IMPS of $250,000.00 to Aarav Mehta completed.",
                timestamp: "Sep 13, 11:06",
                isRead: false,
                type: "transfer"
            ),
            NotificationItem(
                id: "N2",
                title: "Security Alert",
                message: "New device login detected from San Jose, CA.",
                timestamp: "Sep 16, 09:12",
                isRead: false,
                type: "security"
            ),
            NotificationItem(
                id: "N3",
                title: "Credit Card Due",
                message: "Black Diamond card minimum due $8,750.00 by Oct 15.",
                timestamp: "Sep 15, 18:00",
                isRead: true,
                type: "credit"
            ),
            NotificationItem(
                id: "N4",
                title: "KYC Verified",
                message: "Your demo KYC profile is fully verified and active for global transactions.",
                timestamp: "Sep 01, 10:00",
                isRead: true,
                type: "kyc"
            ),
            NotificationItem(
                id: "N5",
                title: "Exclusive Offer",
                message: "Invitation-Only Metal card annual fee waived for UHNW clients this quarter.",
                timestamp: "Sep 08, 12:30",
                isRead: false,
                type: "offer"
            )
        ]

        self.testControls = .default
    }

    public func authenticate(pin: String) -> Bool {
        if pin == "1234" {
            isAuthenticated = true
            return true
        }
        return false
    }

    public func logout() {
        isAuthenticated = false
    }

    public func sendTransfer(
        recipient: String,
        account: String,
        rail: TransferRail,
        amount: Double,
        note: String
    ) -> (success: Bool, error: String?, txId: String?, ref: String?) {
        if testControls.simulateNetworkTimeout {
            return (false, "Simulated network timeout. Please check your connection.", nil, nil)
        }
        if testControls.forceInsufficientBalance || user.balance < amount {
            return (false, "Insufficient demo balance.", nil, nil)
        }
        if testControls.forceTransactionFailure {
            return (false, "Transaction failed: Simulated bank network rejection.", nil, nil)
        }

        let seq = String(format: "%04d", transactionSeq)
        transactionSeq += 1
        let txId = "TGX20260923\(seq)"
        let ref = "REF-\(Int.random(in: 10000000...99999999))"

        user.balance -= amount

        let tx = Transaction(
            id: txId,
            title: "\(rail.rawValue) Transfer",
            recipientOrMerchant: recipient,
            amount: amount,
            isCredit: false,
            type: TransactionType(rawValue: rail.rawValue) ?? .bankTransfer,
            timestamp: "Sep 23, 2026, 12:00",
            category: "Transfers",
            note: note.isEmpty ? "Transfer to \(account)" : note,
            rail: rail.rawValue,
            referenceId: ref
        )
        transactions.insert(tx, at: 0)

        let notif = NotificationItem(
            id: "N\(Int.random(in: 100...999))",
            title: "Transfer Successful",
            message: "\(rail.rawValue) of $\(String(format: "%.2f", amount)) to \(recipient) completed.",
            timestamp: "Just now",
            isRead: false,
            type: "transfer"
        )
        notifications.insert(notif, at: 0)

        return (true, nil, txId, ref)
    }

    public func upiPayment(
        vpa: String,
        merchant: String,
        amount: Double,
        note: String
    ) -> (success: Bool, error: String?, txId: String?) {
        if testControls.simulateNetworkTimeout {
            return (false, "Simulated network timeout. Please check your connection.", nil)
        }
        if testControls.forceInsufficientBalance || user.balance < amount {
            return (false, "Insufficient demo balance.", nil)
        }
        if testControls.forceTransactionFailure {
            return (false, "UPI payment rejected by simulated payment switch.", nil)
        }

        let seq = String(format: "%04d", transactionSeq)
        transactionSeq += 1
        let txId = "TGX20260923\(seq)"

        user.balance -= amount

        let tx = Transaction(
            id: txId,
            title: "UPI Payment",
            recipientOrMerchant: merchant.isEmpty ? vpa : merchant,
            amount: amount,
            isCredit: false,
            type: .upi,
            timestamp: "Sep 23, 2026, 12:00",
            category: "Shopping",
            note: note.isEmpty ? "UPI to \(vpa)" : note,
            rail: "UPI",
            referenceId: "UPI-\(Int.random(in: 100000...999999))"
        )
        transactions.insert(tx, at: 0)

        return (true, nil, txId)
    }

    public func requestCreditLimitIncrease() -> (success: Bool, message: String) {
        user.creditLimit += 250000.0
        user.availableCredit += 250000.0
        user.creditScore = min(850, user.creditScore + 2)
        user.bankingScore = min(999, user.bankingScore + 1)
        return (true, "Simulated credit limit increased by $250,000.00! New Limit: $5,250,000.00")
    }

    public func payCreditBill() -> (success: Bool, error: String?) {
        let payment = user.nextPayment
        guard payment > 0 else {
            return (false, "No outstanding payment due.")
        }
        if testControls.simulateNetworkTimeout {
            return (false, "Simulated network timeout. Please check your connection.")
        }
        if testControls.forceInsufficientBalance || user.balance < payment {
            return (false, "Insufficient demo balance.")
        }
        if testControls.forceTransactionFailure {
            return (false, "Transaction failed: Simulated bank network rejection.")
        }

        user.balance -= payment
        user.usedCredit = max(0, user.usedCredit - payment)
        user.availableCredit += payment
        user.nextPayment = 0

        let seq = String(format: "%04d", transactionSeq)
        transactionSeq += 1
        let tx = Transaction(
            id: "TGX20260923\(seq)",
            title: "Credit Card Bill Payment",
            recipientOrMerchant: "TG Bank Card Services",
            amount: payment,
            isCredit: false,
            type: .creditPay,
            timestamp: "Sep 23, 2026, 12:00",
            category: "Bills",
            note: "Payment for statement cycle",
            referenceId: "CC-\(Int.random(in: 100000...999999))"
        )
        transactions.insert(tx, at: 0)
        return (true, nil)
    }

    // Section 50: Reset Demo Data
    public func resetDemoData() {
        self.user = UserProfile(
            name: "Sanjay G",
            balance: 24588338510.70,
            accountNumber: "**** **** 4588",
            rawAccountNumber: "458890123456",
            accountType: "Ultra High Net Worth Private Banking",
            currency: "USD",
            creditScore: 850,
            creditRating: "World Elite / Exceptional",
            bankingScore: 998,
            creditLimit: 5000000.00,
            availableCredit: 5000000.00,
            usedCredit: 0.00,
            nextPayment: 0.00,
            paymentDue: "Oct 15, 2026",
            kycStatus: .incomplete,
            phone: "+1 (555) 019-4588",
            email: "sanjay.g@testgrid.demo",
            address: "458 Tech Park Blvd, Suite 200, San Jose, CA 95110",
            dob: "14 Aug 1988",
            ifsc: "TGBN0004588",
            upiId: "sanjay@tg",
            relationshipManager: "Priya Menon • Private Banking Desk",
            clientSince: "2012",
            tier: "Black Diamond Ultra"
        )
        self.testControls = .default
        self.isAuthenticated = false // Active screen must be tgBank.login.screen
    }

    public func resetKYC() {
        user.kycStatus = .incomplete
    }

    public func resetCredit() {
        user.usedCredit = 0.0
        user.availableCredit = 5000000.0
        user.nextPayment = 0.0
        user.creditLimit = 5000000.0
    }
}
