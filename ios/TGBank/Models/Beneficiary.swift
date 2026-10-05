import Foundation

public enum TransferRail: String, CaseIterable, Codable {
    case imps = "IMPS"
    case neft = "NEFT"
    case ach = "ACH"
    case rtgs = "RTGS"

    public var title: String {
        switch self {
        case .imps: return "IMPS (Immediate Payment)"
        case .neft: return "NEFT (National Electronic)"
        case .ach: return "ACH (Automated Clearing)"
        case .rtgs: return "RTGS (Real Time Settlement)"
        }
    }

    public var speed: String {
        switch self {
        case .imps: return "Instant (< 5 sec)"
        case .neft: return "30 mins - 2 hrs"
        case .ach: return "Next business day"
        case .rtgs: return "Instant high-speed"
        }
    }

    public var limit: String {
        switch self {
        case .imps: return "Up to $5,000,000"
        case .neft: return "No upper limit"
        case .ach: return "Up to $10,000,000"
        case .rtgs: return "Min $2,000,000"
        }
    }
}

public struct Beneficiary: Identifiable, Codable, Equatable {
    public let id: String
    public let name: String
    public let nickname: String
    public let account: String
    public let ifsc: String
    public let bank: String
    public let rail: TransferRail
    public let isFavorite: Bool
    public let isVerified: Bool

    public init(
        id: String,
        name: String,
        nickname: String,
        account: String,
        ifsc: String,
        bank: String,
        rail: TransferRail,
        isFavorite: Bool = false,
        isVerified: Bool = true
    ) {
        self.id = id
        self.name = name
        self.nickname = nickname
        self.account = account
        self.ifsc = ifsc
        self.bank = bank
        self.rail = rail
        self.isFavorite = isFavorite
        self.isVerified = isVerified
    }
}
