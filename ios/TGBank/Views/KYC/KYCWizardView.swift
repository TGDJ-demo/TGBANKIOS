import SwiftUI
#if canImport(UIKit)
import UIKit
#endif

public struct KYCWizardView: View {
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var repository: BankRepository

    @State private var step: Int = 1 // 1 to 6
    @State private var fullName: String = "Sanjay G"
    @State private var dob: String = "14 Aug 1988"
    @State private var address: String = "458 Tech Park Blvd, Suite 200, San Jose, CA 95110"
    @State private var docType: String = "Passport"
    @State private var isDocumentUploaded: Bool = false
    @State private var isSelfieCaptured: Bool = false
    @State private var showFaceScanner: Bool = false

    public init() {}

    public var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // Step Progress Bar
                HStack(spacing: 4) {
                    ForEach(1...6, id: \.self) { s in
                        Rectangle()
                            .fill(step >= s ? Color.green : Color(uiColor: .systemGray4))
                            .frame(height: 4)
                    }
                }
                .padding(.horizontal)
                .padding(.top, 8)

                ScrollView {
                    VStack(spacing: 20) {
                        switch step {
                        case 1: step1View
                        case 2: step2View
                        case 3: step3View
                        case 4: step4View
                        case 5: step5View
                        default: step6View
                        }
                    }
                    .padding(.vertical)
                }
            }
            .background(Color(uiColor: .systemGroupedBackground))
            .navigationTitle("KYC Verification")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Close") { dismiss() }
                }
            }
            .sheet(isPresented: $showFaceScanner) {
                faceScannerSheet
            }
            .accessibilityIdentifier("tgBank.kyc.screen")
        }
    }

    // Step 1: Personal Information
    private var step1View: some View {
        VStack(spacing: 16) {
            Text("Step 1 — Personal Information")
                .font(.headline)

            VStack(alignment: .leading, spacing: 4) {
                Text("Full Legal Name").font(.caption).foregroundColor(.secondary)
                TextField("Legal Name", text: $fullName)
                    .padding()
                    .background(Color(uiColor: .systemBackground))
                    .cornerRadius(8)
                    .accessibilityIdentifier("tgBank.kyc.fullNameField")
            }

            VStack(alignment: .leading, spacing: 4) {
                Text("Date of Birth").font(.caption).foregroundColor(.secondary)
                TextField("DD MMM YYYY", text: $dob)
                    .padding()
                    .background(Color(uiColor: .systemBackground))
                    .cornerRadius(8)
                    .accessibilityIdentifier("tgBank.kyc.dateOfBirthField")
            }

            VStack(alignment: .leading, spacing: 4) {
                Text("Residential Address").font(.caption).foregroundColor(.secondary)
                TextField("Street, City, State, ZIP", text: $address)
                    .padding()
                    .background(Color(uiColor: .systemBackground))
                    .cornerRadius(8)
                    .accessibilityIdentifier("tgBank.kyc.addressField")
            }

            Button("Continue to Document Upload") {
                step = 2
            }
            .font(.headline)
            .foregroundColor(.white)
            .frame(maxWidth: .infinity)
            .frame(height: 50)
            .background(Color.blue)
            .cornerRadius(10)
            .accessibilityIdentifier("tgBank.kyc.step1.nextButton")
        }
        .padding()
        .background(Color(uiColor: .secondarySystemGroupedBackground))
        .cornerRadius(16)
        .padding(.horizontal)
        .accessibilityIdentifier("tgBank.kyc.wizardCard")
    }

    // Step 2: Document Upload
    private var step2View: some View {
        VStack(spacing: 16) {
            Text("Step 2 — Identity Document")
                .font(.headline)

            VStack(alignment: .leading, spacing: 4) {
                Text("Document Type").font(.caption).foregroundColor(.secondary)
                Picker("Doc Type", selection: $docType) {
                    Text("Passport").tag("Passport")
                    Text("Driver's License").tag("Driver's License")
                    Text("National ID").tag("National ID")
                }
                .pickerStyle(.segmented)
            }

            Button(action: {
                isDocumentUploaded = true
            }) {
                VStack(spacing: 8) {
                    Image(systemName: isDocumentUploaded ? "checkmark.circle.fill" : "arrow.up.doc.fill")
                        .font(.system(size: 36))
                        .foregroundColor(isDocumentUploaded ? .green : .blue)
                    Text(isDocumentUploaded ? "Document Selected: \(docType)_Scan.pdf" : "Simulate Document Upload")
                        .font(.subheadline)
                        .bold()
                }
                .frame(maxWidth: .infinity)
                .frame(height: 120)
                .background(Color(uiColor: .systemGray6))
                .cornerRadius(12)
            }
            .accessibilityIdentifier("tgBank.kyc.uploadDocumentButton")

            if isDocumentUploaded {
                HStack {
                    Image(systemName: "checkmark.seal.fill").foregroundColor(.green)
                    Text("Document verified by automated OCR engine")
                        .font(.caption)
                        .foregroundColor(.green)
                }
                .accessibilityIdentifier("tgBank.kyc.documentUploaded")
            }

            Button("Continue to Document Confirmation") {
                step = 3
            }
            .disabled(!isDocumentUploaded)
            .font(.headline)
            .foregroundColor(.white)
            .frame(maxWidth: .infinity)
            .frame(height: 50)
            .background(isDocumentUploaded ? Color.blue : Color.gray)
            .cornerRadius(10)
            .accessibilityIdentifier("tgBank.kyc.step2.nextButton")
        }
        .padding()
        .background(Color(uiColor: .secondarySystemGroupedBackground))
        .cornerRadius(16)
        .padding(.horizontal)
    }

    // Step 3: Document Confirmation
    private var step3View: some View {
        VStack(spacing: 16) {
            Text("Step 3 — Document Confirmation")
                .font(.headline)

            VStack(spacing: 8) {
                ReviewRow(label: "Document Type", val: docType, id: "tgBank.kyc.confirmDocType")
                ReviewRow(label: "Document Number", val: "USA-P45889012", id: "tgBank.kyc.confirmDocNum")
                ReviewRow(label: "Issuing Country", val: "United States", id: "tgBank.kyc.confirmDocCountry")
                ReviewRow(label: "Expiry Date", val: "2032-10-15", id: "tgBank.kyc.confirmDocExpiry")
            }
            .padding()
            .background(Color(uiColor: .systemBackground))
            .cornerRadius(10)

            Button("Confirm & Proceed to Selfie") {
                step = 4
            }
            .font(.headline)
            .foregroundColor(.white)
            .frame(maxWidth: .infinity)
            .frame(height: 50)
            .background(Color.blue)
            .cornerRadius(10)
            .accessibilityIdentifier("tgBank.kyc.step3.nextButton")
        }
        .padding()
        .background(Color(uiColor: .secondarySystemGroupedBackground))
        .cornerRadius(16)
        .padding(.horizontal)
    }

    // Step 4: Selfie
    private var step4View: some View {
        VStack(spacing: 16) {
            Text("Step 4 — Liveness & Selfie")
                .font(.headline)

            ZStack {
                Circle()
                    .stroke(isSelfieCaptured ? Color.green : Color.blue, lineWidth: 4)
                    .frame(width: 140, height: 140)

                if isSelfieCaptured {
                    Image(systemName: "checkmark")
                        .font(.system(size: 48, weight: .bold))
                        .foregroundColor(.green)
                } else {
                    Image(systemName: "person.fill")
                        .font(.system(size: 64))
                        .foregroundColor(.secondary)
                }
            }
            .padding(.vertical, 8)

            Button(action: { showFaceScanner = true }) {
                HStack {
                    Image(systemName: "camera.fill")
                    Text("Capture Native Selfie")
                }
                .font(.subheadline)
                .foregroundColor(.blue)
                .frame(maxWidth: .infinity)
                .frame(height: 44)
                .background(Color.blue.opacity(0.12))
                .cornerRadius(10)
            }
            .accessibilityIdentifier("tgBank.kyc.captureSelfieButton")

            Button(action: {
                isSelfieCaptured = true
            }) {
                HStack {
                    Image(systemName: "wand.and.stars")
                    Text("Simulate Verified Selfie (Automation)")
                }
                .font(.subheadline)
                .foregroundColor(.primary)
                .frame(maxWidth: .infinity)
                .frame(height: 44)
                .background(Color(uiColor: .systemGray5))
                .cornerRadius(10)
            }
            .accessibilityIdentifier("tgBank.kyc.simulateSelfieButton")

            Button("Continue to Review") {
                step = 5
            }
            .disabled(!isSelfieCaptured)
            .font(.headline)
            .foregroundColor(.white)
            .frame(maxWidth: .infinity)
            .frame(height: 50)
            .background(isSelfieCaptured ? Color.blue : Color.gray)
            .cornerRadius(10)
            .accessibilityIdentifier("tgBank.kyc.step4.nextButton")
        }
        .padding()
        .background(Color(uiColor: .secondarySystemGroupedBackground))
        .cornerRadius(16)
        .padding(.horizontal)
    }

    // Step 5: Review
    private var step5View: some View {
        VStack(spacing: 16) {
            Text("Step 5 — Review Application")
                .font(.headline)

            VStack(spacing: 10) {
                ReviewRow(label: "Full Name", val: fullName, id: "tgBank.kyc.reviewName")
                ReviewRow(label: "Date of Birth", val: dob, id: "tgBank.kyc.reviewDob")
                ReviewRow(label: "Residential Address", val: address, id: "tgBank.kyc.reviewAddress")
                ReviewRow(label: "Document", val: "\(docType) (Verified)", id: "tgBank.kyc.reviewDocument")
                ReviewRow(label: "Biometric Liveness", val: "Passed (100% Match)", id: "tgBank.kyc.reviewSelfie")
            }
            .padding()
            .background(Color(uiColor: .systemBackground))
            .cornerRadius(10)

            Button("Submit KYC Profile") {
                repository.user.kycStatus = .verified
                step = 6
            }
            .font(.headline)
            .foregroundColor(.white)
            .frame(maxWidth: .infinity)
            .frame(height: 50)
            .background(Color.green)
            .cornerRadius(10)
            .accessibilityIdentifier("tgBank.kyc.submitButton")
        }
        .padding()
        .background(Color(uiColor: .secondarySystemGroupedBackground))
        .cornerRadius(16)
        .padding(.horizontal)
        .accessibilityIdentifier("tgBank.kyc.reviewCard")
    }

    // Step 6: Completed
    private var step6View: some View {
        VStack(spacing: 20) {
            Image(systemName: "checkmark.seal.fill")
                .resizable()
                .frame(width: 72, height: 72)
                .foregroundColor(.green)

            Text("KYC Completed Successfully")
                .font(.title2)
                .bold()
                .accessibilityIdentifier("tgBank.kyc.completedTitle")

            Text("Your demo KYC profile is fully verified and active for global banking transactions.")
                .font(.subheadline)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal)
                .accessibilityIdentifier("tgBank.kyc.completedMessage")

            Button("Done") {
                dismiss()
            }
            .font(.headline)
            .foregroundColor(.white)
            .frame(maxWidth: .infinity)
            .frame(height: 50)
            .background(Color.green)
            .cornerRadius(10)
            .accessibilityIdentifier("tgBank.kyc.doneButton")
        }
        .padding()
        .background(Color(uiColor: .secondarySystemGroupedBackground))
        .cornerRadius(16)
        .padding(.horizontal)
    }

    // Face Scanner Modal
    private var faceScannerSheet: some View {
        ZStack {
            Color.black.edgesIgnoringSafeArea(.all)

            VStack {
                HStack {
                    Button(action: { showFaceScanner = false }) {
                        Image(systemName: "xmark.circle.fill")
                            .font(.title)
                            .foregroundColor(.white)
                    }
                    .accessibilityIdentifier("tgBank.faceScanner.closeButton")
                    Spacer()
                }
                .padding()

                Spacer()

                // Face guide oval
                ZStack {
                    Ellipse()
                        .stroke(Color.green, lineWidth: 3)
                        .frame(width: 220, height: 300)
                }
                .accessibilityIdentifier("tgBank.faceScanner.faceGuide")

                Text("Position your face inside the oval")
                    .font(.subheadline)
                    .foregroundColor(.white)
                    .padding(.top, 16)

                Spacer()

                Button(action: {
                    isSelfieCaptured = true
                    showFaceScanner = false
                }) {
                    Circle()
                        .fill(Color.white)
                        .frame(width: 72, height: 72)
                        .overlay(Circle().stroke(Color.black, lineWidth: 2))
                }
                .accessibilityIdentifier("tgBank.faceScanner.shutterButton")
                .padding(.bottom, 36)
            }
        }
        .accessibilityIdentifier("tgBank.faceScanner.screen")
    }
}
