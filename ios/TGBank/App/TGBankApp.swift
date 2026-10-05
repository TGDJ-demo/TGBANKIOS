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
            }
            .tag(AppTab.home)
            .accessibilityIdentifier("tgBank.tab.home")

            NavigationStack(path: $coordinator.paymentsPath) {
                UPIPayView()
            }
            .tabItem {
                Label("UPI & Pay", systemImage: "qrcode.viewfinder")
            }
            .tag(AppTab.payments)
            .accessibilityIdentifier("tgBank.tab.payments")

            NavigationStack(path: $coordinator.transactionsPath) {
                TransactionsListView()
            }
            .tabItem {
                Label("History", systemImage: "clock.arrow.circlepath")
            }
            .tag(AppTab.transactions)
            .accessibilityIdentifier("tgBank.tab.transactions")

            NavigationStack(path: $coordinator.creditPath) {
                CreditDashboardView()
            }
            .tabItem {
                Label("Credit & Loan", systemImage: "creditcard.fill")
            }
            .tag(AppTab.credit)
            .accessibilityIdentifier("tgBank.tab.credit")

            NavigationStack(path: $coordinator.profilePath) {
                ProfileView()
            }
            .tabItem {
                Label("Profile", systemImage: "person.crop.circle.fill")
            }
            .tag(AppTab.profile)
            .accessibilityIdentifier("tgBank.tab.profile")
        }
        .accessibilityIdentifier("tgBank.tabBar")
    }
}
