import Foundation

public struct NotificationItem: Identifiable, Codable, Equatable {
    public let id: String
    public let title: String
    public let message: String
    public let timestamp: String
    public var isRead: Bool
    public let type: String
}
