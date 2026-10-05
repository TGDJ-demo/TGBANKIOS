import Foundation

public struct TestControlState: Codable, Equatable {
    public var forceInsufficientBalance: Bool
    public var forceTransactionFailure: Bool
    public var simulateNetworkTimeout: Bool
    public var simulateUnverifiedKyc: Bool
    public var mockBiometricSuccess: Bool
    public var requirePaymentAuth: Bool
    public var forceOtpAlways: Bool

    public static let `default` = TestControlState(
        forceInsufficientBalance: false,
        forceTransactionFailure: false,
        simulateNetworkTimeout: false,
        simulateUnverifiedKyc: false,
        mockBiometricSuccess: false,
        requirePaymentAuth: true,
        forceOtpAlways: false
    )
}
