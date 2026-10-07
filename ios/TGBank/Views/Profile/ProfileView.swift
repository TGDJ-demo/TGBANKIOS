import SwiftUI
#if canImport(UIKit)
import UIKit
#endif

public struct ProfileView: View {
    @EnvironmentObject var repository: BankRepository
    @EnvironmentObject var coordinator: NavigationCoordinator

    public init() {}

    public var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                // User Card
                VStack(spacing: 12) {
                    Circle()
                        .fill(Color.tgSapphire)
                        .frame(width: 72, height: 72)
                        .overlay(Text("SG").font(.title).bold().foregroundColor(.white))
                        .accessibilityIdentifier("tgBank.profile.avatar")

                    Text(repository.user.name)
                        .font(.title3)
                        .bold()
                        .accessibilityIdentifier("tgBank.profile.name")

                    Text(repository.user.email)
                        .font(.caption)
                        .foregroundColor(.secondary)
                        .accessibilityIdentifier("tgBank.profile.email")

                    HStack(spacing: 6) {
                        Image(systemName: repository.user.kycStatus == .verified ? "checkmark.shield.fill" : "exclamationmark.shield.fill")
                            .foregroundColor(repository.user.kycStatus == .verified ? .green : .orange)
                        Text("KYC: \(repository.user.kycStatus.rawValue)")
                            .font(.caption)
                            .bold()
                            .foregroundColor(repository.user.kycStatus == .verified ? .green : .orange)
                    }
                    .padding(.horizontal, 10)
                    .padding(.vertical, 4)
                    .background(Color(uiColor: .systemGray6))
                    .cornerRadius(8)
                    .accessibilityIdentifier("tgBank.profile.kycStatus")
                }
                .padding()
                .frame(maxWidth: .infinity)
                .background(Color(uiColor: .secondarySystemGroupedBackground))
                .cornerRadius(16)
                .padding(.horizontal)

                // Theme Card
                VStack(alignment: .leading, spacing: 10) {
                    Text("Theme Appearance")
                        .font(.headline)

                    HStack(spacing: 8) {
                        ThemeButton(title: "System", active: repository.selectedTheme == .system, id: "tgBank.profile.theme.system") {
                            repository.selectedTheme = .system
                        }
                        ThemeButton(title: "Light", active: repository.selectedTheme == .light, id: "tgBank.profile.theme.light") {
                            repository.selectedTheme = .light
                        }
                        ThemeButton(title: "Dark", active: repository.selectedTheme == .dark, id: "tgBank.profile.theme.dark") {
                            repository.selectedTheme = .dark
                        }
                    }
                }
                .padding()
                .background(Color(uiColor: .secondarySystemGroupedBackground))
                .cornerRadius(16)
                .padding(.horizontal)
                .accessibilityIdentifier("tgBank.profile.themeCard")

                // Language Card (IDs must remain in English!)
                VStack(alignment: .leading, spacing: 10) {
                    Text("App Language")
                        .font(.headline)

                    LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 8), count: 3), spacing: 8) {
                        LanguageButton(title: "English", active: repository.selectedLanguage == .en, id: "tgBank.profile.language.en") {
                            repository.selectedLanguage = .en
                        }
                        LanguageButton(title: "Español", active: repository.selectedLanguage == .es, id: "tgBank.profile.language.es") {
                            repository.selectedLanguage = .es
                        }
                        LanguageButton(title: "Français", active: repository.selectedLanguage == .fr, id: "tgBank.profile.language.fr") {
                            repository.selectedLanguage = .fr
                        }
                        LanguageButton(title: "हिन्दी", active: repository.selectedLanguage == .hi, id: "tgBank.profile.language.hi") {
                            repository.selectedLanguage = .hi
                        }
                        LanguageButton(title: "Deutsch", active: repository.selectedLanguage == .de, id: "tgBank.profile.language.de") {
                            repository.selectedLanguage = .de
                        }
                        LanguageButton(title: "日本語", active: repository.selectedLanguage == .ja, id: "tgBank.profile.language.ja") {
                            repository.selectedLanguage = .ja
                        }
                    }
                }
                .padding()
                .background(Color(uiColor: .secondarySystemGroupedBackground))
                .cornerRadius(16)
                .padding(.horizontal)
                .accessibilityIdentifier("tgBank.profile.languageCard")

                // Security Settings
                VStack(alignment: .leading, spacing: 12) {
                    Text("Security Settings")
                        .font(.headline)

                    HStack {
                        Image(systemName: "faceid").foregroundColor(.tgSapphire)
                        Text("Biometric Unlock (Face ID)")
                        Spacer()
                        Image(systemName: "checkmark").foregroundColor(.tgTeal)
                    }
                    .padding(.vertical, 4)
                    .accessibilityIdentifier("tgBank.profile.biometricSettings")

                    Divider()

                    HStack {
                        Image(systemName: "lock.shield").foregroundColor(.tgSapphire)
                        Text("Security PIN: 1234")
                        Spacer()
                        Text("Change PIN")
                            .font(.caption)
                            .bold()
                            .foregroundColor(.tgSapphire)
                    }
                    .padding(.vertical, 4)
                    .accessibilityIdentifier("tgBank.profile.changePin")
                }
                .padding()
                .background(Color(uiColor: .secondarySystemGroupedBackground))
                .cornerRadius(16)
                .padding(.horizontal)
                .accessibilityIdentifier("tgBank.profile.securitySettings")

                // Test Controls Shortcut Button
                Button(action: {
                    coordinator.isShowingTestControls = true
                }) {
                    HStack {
                        Image(systemName: "slider.horizontal.3").foregroundColor(.tgPurple)
                        Text("TestGrid Automation & Edge Case Controls")
                            .font(.subheadline)
                            .bold()
                            .foregroundColor(.tgPurple)
                        Spacer()
                        Image(systemName: "chevron.right").font(.caption).foregroundColor(.secondary)
                    }
                    .padding()
                    .background(Color.tgPurple.opacity(0.12))
                    .cornerRadius(16)
                }
                .padding(.horizontal)

                // Sign Out
                Button(action: {
                    repository.logout()
                }) {
                    Text("Sign Out")
                        .font(.headline)
                        .foregroundColor(.red)
                        .frame(maxWidth: .infinity)
                        .frame(height: 48)
                        .background(Color.red.opacity(0.1))
                        .cornerRadius(12)
                }
                .padding(.horizontal)

                Spacer().frame(height: 24)
            }
            .padding(.vertical)
        }
        .background(Color(uiColor: .systemGroupedBackground))
        .navigationTitle("Profile")
        .accessibilityIdentifier("tgBank.profile.screen")
    }
}

struct ThemeButton: View {
    let title: String
    let active: Bool
    let id: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.caption)
                .bold()
                .foregroundColor(active ? .white : .primary)
                .frame(maxWidth: .infinity)
                .frame(height: 38)
                .background(active ? Color.tgSapphire : Color(uiColor: .systemGray5))
                .cornerRadius(8)
        }
        .accessibilityIdentifier(id)
    }
}

struct LanguageButton: View {
    let title: String
    let active: Bool
    let id: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.caption2)
                .bold()
                .foregroundColor(active ? .white : .primary)
                .frame(maxWidth: .infinity)
                .frame(height: 36)
                .background(active ? Color.tgSapphire : Color(uiColor: .systemGray5))
                .cornerRadius(8)
        }
        .accessibilityIdentifier(id)
    }
}
