import Foundation

public enum TransactionType: String, CaseIterable, Codable {
    case all = "ALL"
    case upi = "UPI"
    case bankTransfer = "BANK_TRANSFER"
    case card = "CARD"
    case atm = "ATM"
    case salary = "SALARY"
    case addMoney = "ADD_MONEY"
    case billPay = "BILL_PAY"
    case creditPay = "CREDIT_PAY"
    case imps = "IMPS"
    case neft = "NEFT"
    case ach = "ACH"
    case rtgs = "RTGS"
}

public struct Transaction: Identifiable, Codable, Equatable {
    public let id: String
    public let title: String
    public let recipientOrMerchant: String
    public let amount: Double
    public let isCredit: Bool
    public let type: TransactionType
    public let timestamp: String
    public let status: String
    public let category: String
    public let note: String
    public let rail: String?
    public let referenceId: String

    public init(
        id: String,
        title: String,
        recipientOrMerchant: String,
        amount: Double,
        isCredit: Bool,
        type: TransactionType,
        timestamp: String,
        status: String = "Completed",
        category: String,
        note: String,
        rail: String? = nil,
        referenceId: String
    ) {
        self.id = id
        self.title = title
        self.recipientOrMerchant = recipientOrMerchant
        self.amount = amount
        self.isCredit = isCredit
        self.type = type
        self.timestamp = timestamp
        self.status = status
        self.category = category
        self.note = note
        self.rail = rail
        self.referenceId = referenceId
    }
}
