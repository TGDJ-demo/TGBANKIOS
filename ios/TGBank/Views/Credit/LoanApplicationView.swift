import SwiftUI

#if canImport(UIKit)
import UIKit
#endif

public struct LoanApplicationView: View {
    @Environment(\.dismiss) var dismiss

    @State private var requestedAmount: Double = 25000
    @State private var employmentType: String = "Full-Time Salaried"
    @State private var monthlyIncome: String = "12500"
    @State private var loanPurpose: String = "Home Improvement"
    @State private var tenureMonths: Double = 36
    @State private var apr: Double = 8.5

    @State private var isApproved: Bool = false
    @State private var approvalId: String = ""

    public init() {}

    private var calculatedEmi: Double {
        let p = requestedAmount
        let r = (apr / 12.0) / 100.0
        let n = tenureMonths
        guard p > 0, r > 0, n > 0 else { return 0 }
        let factor = pow(1.0 + r, n)
        return (p * r * factor) / (factor - 1.0)
    }

    private var totalRepayment: Double {
        calculatedEmi * tenureMonths
    }

    private var totalInterest: Double {
        max(0, totalRepayment - requestedAmount)
    }

    public var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    if isApproved {
                        approvalCardView
                    } else {
                        calculatorCardView
                        applicationFieldsCardView
                    }
                }
                .padding(.vertical)
            }
            .background(Color(uiColor: .systemGroupedBackground))
            .navigationTitle("Loan Application")
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("Close") { dismiss() }
                }
            }
            .accessibilityIdentifier("tgBank.loan.screen")
        }
    }

    private var calculatorCardView: some View {
        VStack(spacing: 16) {
            HStack {
                Text("Dynamic EMI Calculator")
                    .font(.headline)
                Spacer()
                Text("\(apr, specifier: "%.1f")% APR")
                    .font(.caption)
                    .bold()
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(Color.tgSapphire.opacity(0.12))
                    .foregroundColor(.tgSapphire)
                    .cornerRadius(8)
                    .accessibilityIdentifier("tgBank.loan.aprBadge")
            }

            // Big EMI Display
            VStack(spacing: 4) {
                Text("Monthly EMI Payment")
                    .font(.caption)
                    .foregroundColor(.secondary)
                Text(String(format: "$%.2f", calculatedEmi))
                    .font(.system(size: 36, weight: .bold))
                    .foregroundColor(.tgSapphire)
                    .accessibilityIdentifier("tgBank.loan.calculatedEmi")
            }

            // Summary grid
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text("Principal").font(.caption2).foregroundColor(.secondary)
                    Text(String(format: "$%.2f", requestedAmount))
                        .font(.footnote).bold()
                        .accessibilityIdentifier("tgBank.loan.principalSummary")
                }
                Spacer()
                VStack(alignment: .center, spacing: 2) {
                    Text("Total Interest").font(.caption2).foregroundColor(.secondary)
                    Text(String(format: "$%.2f", totalInterest))
                        .font(.footnote).bold()
                        .accessibilityIdentifier("tgBank.loan.totalInterest")
                }
                Spacer()
                VStack(alignment: .trailing, spacing: 2) {
                    Text("Total Repayment").font(.caption2).foregroundColor(.secondary)
                    Text(String(format: "$%.2f", totalRepayment))
                        .font(.footnote).bold().foregroundColor(.tgPurple)
                        .accessibilityIdentifier("tgBank.loan.totalRepayment")
                }
            }
            .padding(10)
            .background(Color(uiColor: .systemGray6))
            .cornerRadius(10)

            // Preset Amounts
            HStack {
                Button("$5,000") { requestedAmount = 5000 }
                    .font(.caption2).bold().padding(6).background(Color(uiColor: .systemGray5)).cornerRadius(6)
                    .accessibilityIdentifier("tgBank.loan.preset.5000")
                Button("$15,000") { requestedAmount = 15000 }
                    .font(.caption2).bold().padding(6).background(Color(uiColor: .systemGray5)).cornerRadius(6)
                    .accessibilityIdentifier("tgBank.loan.preset.15000")
                Button("$25,000") { requestedAmount = 25000 }
                    .font(.caption2).bold().padding(6).background(Color(uiColor: .systemGray5)).cornerRadius(6)
                    .accessibilityIdentifier("tgBank.loan.preset.25000")
                Button("$50,000") { requestedAmount = 50000 }
                    .font(.caption2).bold().padding(6).background(Color(uiColor: .systemGray5)).cornerRadius(6)
                    .accessibilityIdentifier("tgBank.loan.preset.50000")
            }

            // APR Slider
            VStack(alignment: .leading, spacing: 4) {
                HStack {
                    Text("Annual Interest Rate (APR)").font(.caption).foregroundColor(.secondary)
                    Spacer()
                    Text("\(apr, specifier: "%.1f")%")
                        .font(.caption).bold()
                        .accessibilityIdentifier("tgBank.loan.currentApr")
                }
                Slider(value: $apr, in: 5.0...18.0, step: 0.1)
                    .accessibilityIdentifier("tgBank.loan.aprSlider")
            }
        }
        .padding()
        .background(Color(uiColor: .secondarySystemGroupedBackground))
        .cornerRadius(16)
        .padding(.horizontal)
        .accessibilityIdentifier("tgBank.loan.emiCalculatorCard")
    }

    private var applicationFieldsCardView: some View {
        VStack(spacing: 14) {
            VStack(alignment: .leading, spacing: 4) {
                Text("Requested Amount ($)").font(.caption).foregroundColor(.secondary)
                TextField("25000", value: $requestedAmount, format: .number)
                    .padding()
                    .background(Color(uiColor: .systemBackground))
                    .cornerRadius(8)
                    #if os(iOS)
                    .keyboardType(.numberPad)
                    #endif
                    .accessibilityIdentifier("tgBank.loan.requestedAmountField")
            }

            VStack(alignment: .leading, spacing: 4) {
                Text("Employment Type").font(.caption).foregroundColor(.secondary)
                TextField("Full-Time Salaried", text: $employmentType)
                    .padding()
                    .background(Color(uiColor: .systemBackground))
                    .cornerRadius(8)
                    .accessibilityIdentifier("tgBank.loan.employmentField")
            }

            VStack(alignment: .leading, spacing: 4) {
                Text("Monthly Income ($)").font(.caption).foregroundColor(.secondary)
                TextField("12500", text: $monthlyIncome)
                    .padding()
                    .background(Color(uiColor: .systemBackground))
                    .cornerRadius(8)
                    #if os(iOS)
                    .keyboardType(.numberPad)
                    #endif
                    .accessibilityIdentifier("tgBank.loan.monthlyIncomeField")
            }

            VStack(alignment: .leading, spacing: 4) {
                Text("Loan Purpose").font(.caption).foregroundColor(.secondary)
                TextField("Home Improvement", text: $loanPurpose)
                    .padding()
                    .background(Color(uiColor: .systemBackground))
                    .cornerRadius(8)
                    .accessibilityIdentifier("tgBank.loan.purposeField")
            }

            VStack(alignment: .leading, spacing: 4) {
                Text("Duration (Months)").font(.caption).foregroundColor(.secondary)
                TextField("36", value: $tenureMonths, format: .number)
                    .padding()
                    .background(Color(uiColor: .systemBackground))
                    .cornerRadius(8)
                    #if os(iOS)
                    .keyboardType(.numberPad)
                    #endif
                    .accessibilityIdentifier("tgBank.loan.durationField")
            }

            Button(action: handleLoanSubmit) {
                Text("Submit Loan Application")
                    .font(.headline)
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .frame(height: 50)
                    .background(Color.tgPurple)
                    .cornerRadius(10)
            }
            .accessibilityIdentifier("tgBank.loan.submitButton")
        }
        .padding()
        .background(Color(uiColor: .secondarySystemGroupedBackground))
        .cornerRadius(16)
        .padding(.horizontal)
    }

    private var approvalCardView: some View {
        VStack(spacing: 20) {
            Image(systemName: "checkmark.seal.fill")
                .resizable()
                .frame(width: 64, height: 64)
                .foregroundColor(.tgTeal)

            Text("Application Approved")
                .font(.title2)
                .bold()
                .accessibilityIdentifier("tgBank.loan.approvalTitle")

            Text("Congratulations! Your simulated loan has been pre-approved instantly based on your credit score.")
                .font(.caption)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal)

            VStack(spacing: 10) {
                ReviewRow(label: "Approval ID", val: approvalId, id: "tgBank.loan.approvalId")
                ReviewRow(label: "Approved Amount", val: String(format: "$%.2f", requestedAmount), id: "tgBank.loan.approvalAmount")
                ReviewRow(label: "APR", val: String(format: "%.1f%%", apr), id: "tgBank.loan.approvalApr")
                ReviewRow(label: "Tenure", val: "\(Int(tenureMonths)) Months", id: "tgBank.loan.approvalTenure")
                ReviewRow(label: "Monthly EMI", val: String(format: "$%.2f", calculatedEmi), id: "tgBank.loan.approvalEmi")
                ReviewRow(label: "Total Repayment", val: String(format: "$%.2f", totalRepayment), id: "tgBank.loan.approvalTotalRepayment")
            }
            .padding()
            .background(Color(uiColor: .systemBackground))
            .cornerRadius(12)

            Button("Done") { dismiss() }
                .font(.headline)
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .frame(height: 48)
                .background(Color.tgTeal)
                .cornerRadius(10)
                .accessibilityIdentifier("tgBank.loan.doneButton")
        }
        .padding()
        .background(Color(uiColor: .secondarySystemGroupedBackground))
        .cornerRadius(16)
        .padding(.horizontal)
        .accessibilityIdentifier("tgBank.loan.approvalCard")
    }

    private func handleLoanSubmit() {
        approvalId = "LN-2026-\(Int.random(in: 1000...9999))"
        isApproved = true
    }
}
