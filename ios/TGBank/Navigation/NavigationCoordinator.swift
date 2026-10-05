import Foundation
import SwiftUI

public enum AppTab: Hashable {
    case home
    case payments
    case transactions
    case credit
    case profile
}

public class NavigationCoordinator: ObservableObject {
    @Published public var selectedTab: AppTab = .home
    @Published public var homePath = NavigationPath()
    @Published public var paymentsPath = NavigationPath()
    @Published public var transactionsPath = NavigationPath()
    @Published public var creditPath = NavigationPath()
    @Published public var profilePath = NavigationPath()

    // Modals
    @Published public var isShowingNotifications: Bool = false
    @Published public var isShowingTestControls: Bool = false
    @Published public var isShowingSendMoney: Bool = false
    @Published public var isShowingReceiveMoney: Bool = false
    @Published public var isShowingAddMoney: Bool = false
    @Published public var isShowingWithdraw: Bool = false
    @Published public var isShowingPayBills: Bool = false
    @Published public var isShowingKYCWizard: Bool = false
    @Published public var isShowingLoanApplication: Bool = false
    @Published public var isShowingQRScanner: Bool = false
    @Published public var selectedTransaction: Transaction? = nil

    public init() {}
}
