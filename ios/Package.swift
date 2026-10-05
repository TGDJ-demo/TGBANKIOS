// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "TGBank",
    defaultLocalization: "en",
    platforms: [
        .iOS(.v16)
    ],
    products: [
        .library(
            name: "TGBank",
            targets: ["TGBank"]
        ),
    ],
    dependencies: [],
    targets: [
        .target(
            name: "TGBank",
            dependencies: [],
            path: "TGBank"
        ),
        .testTarget(
            name: "TGBankUITests",
            dependencies: ["TGBank"],
            path: "TGBankUITests"
        )
    ]
)
