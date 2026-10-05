import Foundation

public struct EliteCreditCard: Identifiable, Codable, Equatable {
    public let id: String
    public let name: String
    public let tier: String
    public let cardNumber: String
    public let expiry: String
    public let holder: String
    public let limit: Double
    public let available: Double
    public let used: Double
    public let perks: String
}
