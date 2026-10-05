import Foundation

public struct UserProfile: Codable, Equatable {
    public var name: String
    public var balance: Double
    public var accountNumber: String
    public var rawAccountNumber: String
    public var accountType: String
    public var currency: String
    public var creditScore: Int
    public var creditRating: String
    public var bankingScore: Int
    public var creditLimit: Double
    public var availableCredit: Double
    public var usedCredit: Double
    public var nextPayment: Double
    public var paymentDue: String
    public var kycStatus: KYCStatus
    public var phone: String
    public var email: String
    public var address: String
    public var dob: String
    public var ifsc: String
    public var upiId: String
    public var relationshipManager: String
    public var clientSince: String
    public var tier: String
}

public enum KYCStatus: String, Codable {
    case verified = "Verified"
    case incomplete = "Incomplete"
    case pending = "Pending"
}

public enum AppLanguage: String, CaseIterable, Identifiable {
    case en = "en"
    case es = "es"
    case fr = "fr"
    case hi = "hi"
    case de = "de"
    case ja = "ja"

    public var id: String { rawValue }

    public var displayName: String {
        switch self {
        case .en: return "English"
        case .es: return "Español"
        case .fr: return "Français"
        case .hi: return "हिन्दी"
        case .de: return "Deutsch"
        case .ja: return "日本語"
        }
    }
}

public enum AppThemeMode: String, CaseIterable, Identifiable {
    case system = "System"
    case light = "Light"
    case dark = "Dark"

    public var id: String { rawValue }
}
