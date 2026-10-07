import SwiftUI

#if canImport(UIKit)
import UIKit
#endif

// MARK: - Safe Cross-Platform Color Extensions
extension Color {
    public static let tgSapphire = Color(red: 0.08, green: 0.22, blue: 0.43)
    public static let tgTeal = Color(red: 0.05, green: 0.58, blue: 0.55)
    public static let tgPink = Color(red: 0.82, green: 0.28, blue: 0.52)
    public static let tgPurple = Color(red: 0.43, green: 0.31, blue: 0.65)
    public static let tgMidnight = Color(red: 0.035, green: 0.08, blue: 0.16)

    #if canImport(UIKit)
    /// Convenience initializer mapping UIColor directly to SwiftUI Color
    /// without resolving ambiguity against CGColor.
    @inlinable
    public init(_ uiColor: UIColor) {
        self.init(uiColor: uiColor)
    }
    #endif

    public static var tgSystemBackground: Color {
        #if canImport(UIKit)
        return Color(uiColor: .systemBackground)
        #else
        return Color.white
        #endif
    }

    public static var tgSecondarySystemBackground: Color {
        #if canImport(UIKit)
        return Color(uiColor: .secondarySystemBackground)
        #else
        return Color.gray.opacity(0.1)
        #endif
    }

    public static var tgSystemGroupedBackground: Color {
        #if canImport(UIKit)
        return Color(uiColor: .systemGroupedBackground)
        #else
        return Color.gray.opacity(0.08)
        #endif
    }

    public static var tgSecondarySystemGroupedBackground: Color {
        #if canImport(UIKit)
        return Color(uiColor: .secondarySystemGroupedBackground)
        #else
        return Color.white
        #endif
    }

    public static var tgSystemGray4: Color {
        #if canImport(UIKit)
        return Color(uiColor: .systemGray4)
        #else
        return Color.gray.opacity(0.3)
        #endif
    }

    public static var tgSystemGray5: Color {
        #if canImport(UIKit)
        return Color(uiColor: .systemGray5)
        #else
        return Color.gray.opacity(0.2)
        #endif
    }

    public static var tgSystemGray6: Color {
        #if canImport(UIKit)
        return Color(uiColor: .systemGray6)
        #else
        return Color.gray.opacity(0.12)
        #endif
    }
}
