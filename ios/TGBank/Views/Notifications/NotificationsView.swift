import SwiftUI
#if canImport(UIKit)
import UIKit
#endif

public struct NotificationsView: View {
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var repository: BankRepository

    public init() {}

    public var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // Top Action Bar
                HStack {
                    Button(action: {
                        for i in repository.notifications.indices {
                            repository.notifications[i].isRead = true
                        }
                    }) {
                        Text("Mark All Read")
                            .font(.caption)
                            .bold()
                            .padding(.horizontal, 10)
                            .padding(.vertical, 6)
                            .background(Color(uiColor: .systemGray5))
                            .cornerRadius(8)
                    }
                    .accessibilityIdentifier("tgBank.notifications.markAllReadButton")

                    Spacer()

                    Button(action: {
                        repository.notifications.removeAll()
                    }) {
                        Text("Clear All")
                            .font(.caption)
                            .bold()
                            .foregroundColor(.red)
                            .padding(.horizontal, 10)
                            .padding(.vertical, 6)
                            .background(Color.red.opacity(0.1))
                            .cornerRadius(8)
                    }
                    .accessibilityIdentifier("tgBank.notifications.clearAllButton")
                }
                .padding(.horizontal)
                .padding(.vertical, 8)
                .background(Color(uiColor: .secondarySystemGroupedBackground))

                if repository.notifications.isEmpty {
                    VStack(spacing: 12) {
                        Spacer()
                        Image(systemName: "bell.slash")
                            .font(.system(size: 48))
                            .foregroundColor(.secondary)
                        Text("No notifications")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                        Spacer()
                    }
                } else {
                    List {
                        ForEach(repository.notifications) { item in
                            NotificationRowView(item: item)
                                .listRowInsets(EdgeInsets(top: 4, leading: 16, bottom: 4, trailing: 16))
                                .listRowBackground(Color.clear)
                                .listRowSeparator(.hidden)
                        }
                    }
                    .listStyle(.plain)
                }
            }
            .background(Color(uiColor: .systemGroupedBackground))
            .navigationTitle("Notification Center")
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Close") { dismiss() }
                }
            }
            .accessibilityIdentifier("tgBank.notifications.screen")
        }
    }
}

struct NotificationRowView: View {
    let item: NotificationItem

    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            ZStack {
                Circle()
                    .fill(item.isRead ? Color(uiColor: .systemGray5) : Color.blue.opacity(0.15))
                    .frame(width: 36, height: 36)
                Image(systemName: iconForType(item.type))
                    .font(.system(size: 16))
                    .foregroundColor(item.isRead ? .secondary : .blue)
            }

            VStack(alignment: .leading, spacing: 4) {
                HStack {
                    Text(item.title)
                        .font(.subheadline)
                        .bold()
                        .foregroundColor(.primary)
                        .accessibilityIdentifier("tgBank.notifications.item.\(item.id).title")

                    Spacer()

                    Text(item.timestamp)
                        .font(.caption2)
                        .foregroundColor(.secondary)
                        .accessibilityIdentifier("tgBank.notifications.item.\(item.id).timestamp")
                }

                Text(item.message)
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .accessibilityIdentifier("tgBank.notifications.item.\(item.id).message")

                HStack {
                    Spacer()
                    Text(item.isRead ? "Read" : "Unread")
                        .font(.system(size: 9, weight: .bold))
                        .padding(.horizontal, 6)
                        .padding(.vertical, 2)
                        .background(item.isRead ? Color(uiColor: .systemGray5) : Color.blue.opacity(0.2))
                        .foregroundColor(item.isRead ? .secondary : .blue)
                        .cornerRadius(4)
                        .accessibilityIdentifier("tgBank.notifications.item.\(item.id).readState")
                }
            }
        }
        .padding(12)
        .background(Color(uiColor: .secondarySystemGroupedBackground))
        .cornerRadius(12)
        .accessibilityIdentifier("tgBank.notifications.item.\(item.id)")
    }

    private func iconForType(_ type: String) -> String {
        switch type {
        case "transfer": return "arrow.left.arrow.right"
        case "security": return "shield.lefthalf.filled"
        case "credit": return "creditcard"
        case "kyc": return "person.crop.circle.badge.checkmark"
        case "offer": return "gift"
        default: return "bell"
        }
    }
}
