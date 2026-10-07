import SwiftUI
import AVFoundation

public struct QRScannerView: View {
    @Environment(\.dismiss) var dismiss
    public var onScanned: (String, String, Double) -> Void

    @State private var isTorchOn: Bool = false
    @State private var cameraPosition: AVCaptureDevice.Position = .back

    public init(onScanned: @escaping (String, String, Double) -> Void) {
        self.onScanned = onScanned
    }

    public var body: some View {
        ZStack {
            Color.black.edgesIgnoringSafeArea(.all)

            // Camera preview or fallback simulator
            VStack {
                Spacer()
                
                // Reticle
                ZStack {
                    RoundedRectangle(cornerRadius: 16)
                        .stroke(Color.white.opacity(0.8), lineWidth: 3)
                        .frame(width: 240, height: 240)
                    
                    // Scanning line animation
                    Rectangle()
                        .fill(Color.tgPurple)
                        .frame(width: 220, height: 2)
                }
                .accessibilityIdentifier("tgBank.qrScanner.reticle")

                Text("Point camera at any UPI QR code")
                    .font(.footnote)
                    .foregroundColor(.white.opacity(0.8))
                    .padding(.top, 16)

                Spacer()

                // Deterministic Demo QR Scenarios for Automation
                VStack(spacing: 8) {
                    Text("Automated Testing Shortcuts (Deterministic Sim)")
                        .font(.caption2)
                        .foregroundColor(.white.opacity(0.6))

                    HStack(spacing: 8) {
                        Button("TG Demo ($125)") {
                            onScanned("merchant@tg", "TG Demo Store", 125.0)
                        }
                        .font(.caption2)
                        .padding(.horizontal, 10)
                        .padding(.vertical, 8)
                        .background(Color.white.opacity(0.2))
                        .foregroundColor(.white)
                        .cornerRadius(8)
                        .accessibilityIdentifier("tgBank.qrScanner.demoMerchant1")

                        Button("Blue Bottle ($14.50)") {
                            onScanned("bluebottle@tg", "Blue Bottle Coffee", 14.50)
                        }
                        .font(.caption2)
                        .padding(.horizontal, 10)
                        .padding(.vertical, 8)
                        .background(Color.white.opacity(0.2))
                        .foregroundColor(.white)
                        .cornerRadius(8)
                        .accessibilityIdentifier("tgBank.qrScanner.demoMerchant2")

                        Button("Enterprise ($499)") {
                            onScanned("cloud@tg", "TechGrid Cloud", 499.0)
                        }
                        .font(.caption2)
                        .padding(.horizontal, 10)
                        .padding(.vertical, 8)
                        .background(Color.white.opacity(0.2))
                        .foregroundColor(.white)
                        .cornerRadius(8)
                        .accessibilityIdentifier("tgBank.qrScanner.demoMerchant3")
                    }
                }
                .padding(.bottom, 24)
            }

            // Top controls
            VStack {
                HStack {
                    Button(action: { dismiss() }) {
                        Image(systemName: "xmark.circle.fill")
                            .font(.title)
                            .foregroundColor(.white)
                    }
                    .accessibilityIdentifier("tgBank.qrScanner.closeButton")

                    Spacer()

                    Button(action: { isTorchOn.toggle() }) {
                        Image(systemName: isTorchOn ? "bolt.fill" : "bolt.slash.fill")
                            .font(.title2)
                            .foregroundColor(.white)
                    }
                    .accessibilityIdentifier("tgBank.qrScanner.flashButton")

                    Button(action: {
                        cameraPosition = cameraPosition == .back ? .front : .back
                    }) {
                        Image(systemName: "camera.rotate.fill")
                            .font(.title2)
                            .foregroundColor(.white)
                    }
                    .accessibilityIdentifier("tgBank.qrScanner.switchCameraButton")
                }
                .padding()
                Spacer()
            }
        }
        .accessibilityIdentifier("tgBank.qrScanner.screen")
    }
}
