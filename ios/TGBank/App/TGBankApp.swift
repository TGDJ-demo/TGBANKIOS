import SwiftUI

@main
struct TGBankApp: App {
    @StateObject private var repository = BankRepository()
    @StateObject private var coordinator = NavigationCoordinator()
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(repository)
                .environmentObject(coordinator)
                .tint(.tgSapphire)
                .font(.system(.body, design: .rounded))
                .preferredColorScheme(repository.colorScheme)
        }
    }
}

struct ContentView: View {
    @EnvironmentObject var repository: BankRepository
    @EnvironmentObject var coordinator: NavigationCoordinator

    var body: some View {
        Group {
            if repository.isAuthenticated {
                MainTabView()
            } else {
                LoginView()
            }
        }
    }
}

struct MainTabView: View {
    @EnvironmentObject var repository: BankRepository
    @EnvironmentObject var coordinator: NavigationCoordinator

    var body: some View {
        TabView(selection: $coordinator.selectedTab) {
            NavigationStack(path: $coordinator.homePath) {
                HomeView()
            }
            .tabItem {
                Label("Home", systemImage: "house.fill")
                    .accessibilityIdentifier("tgBank.tab.home")
            }
            .tag(AppTab.home)

            NavigationStack(path: $coordinator.paymentsPath) {
                UPIPayView()
            }
            .tabItem {
                Label("UPI & Pay", systemImage: "qrcode.viewfinder")
                    .accessibilityIdentifier("tgBank.tab.payments")
            }
            .tag(AppTab.payments)

            NavigationStack(path: $coordinator.transactionsPath) {
                TransactionsListView()
            }
            .tabItem {
                Label("History", systemImage: "clock.arrow.circlepath")
                    .accessibilityIdentifier("tgBank.tab.transactions")
            }
            .tag(AppTab.transactions)

            NavigationStack(path: $coordinator.creditPath) {
                CreditDashboardView()
            }
            .tabItem {
                Label("Credit & Loan", systemImage: "creditcard.fill")
                    .accessibilityIdentifier("tgBank.tab.credit")
            }
            .tag(AppTab.credit)

            NavigationStack(path: $coordinator.profilePath) {
                ProfileView()
            }
            .tabItem {
                Label("Profile", systemImage: "person.crop.circle.fill")
                    .accessibilityIdentifier("tgBank.tab.profile")
            }
            .tag(AppTab.profile)
        }
        .accessibilityIdentifier("tgBank.tabBar")
    }
}
