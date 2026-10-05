import SwiftUI
#if canImport(UIKit)
import UIKit
#endif

public struct CreditDashboardView: View {
    @EnvironmentObject var repository: BankRepository
    @EnvironmentObject var coordinator: NavigationCoordinator

    @State private var increaseMessage: String? = nil
    @State private var statementMessage: String? = nil
    @State private var paymentErrorMessage: String? = nil

    public init() {}

    public var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                // Score Card
                VStack(spacing: 12) {
                    HStack {
                        VStack(alignment: .leading, spacing: 2) {
                            Text("Credit Score (FICO / Experian)")
                                .font(.caption)
                                .foregroundColor(.secondary)
                            Text(repository.user.creditRating)
                                .font(.subheadline)
                                .bold()
                                .foregroundColor(.green)
                                .accessibilityIdentifier("tgBank.credit.rating")
                        }
                        Spacer()
                        ZStack {
                            Circle()
                                .stroke(Color.green.opacity(0.2), lineWidth: 6)
                                .frame(width: 60, height: 60)
                            Circle()
                                .trim(from: 0, to: 0.95)
                                .stroke(Color.green, style: StrokeStyle(lineWidth: 6, lineCap: .round))
                                .frame(width: 60, height: 60)
                                .rotationEffect(.degrees(-90))
                            Text("\(repository.user.creditScore)")
                                .font(.system(size: 18, weight: .bold))
                                .accessibilityIdentifier("tgBank.credit.scoreValue")
                        }
                    }
                }
                .padding()
                .background(Color(uiColor: .secondarySystemGroupedBackground))
                .cornerRadius(16)
                .padding(.horizontal)
                .accessibilityIdentifier("tgBank.credit.scoreCard")

                // Overview Card
                VStack(spacing: 14) {
                    HStack {
                        Text("Credit Account Summary")
                            .font(.headline)
                        Spacer()
                        Text("Due: \(repository.user.paymentDue)")
                            .font(.caption2)
                            .foregroundColor(.secondary)
                    }

                    Divider()

                    HStack {
                        VStack(alignment: .leading, spacing: 2) {
                            Text("Total Limit").font(.caption2).foregroundColor(.secondary)
                            Text(String(format: "$%.2f", repository.user.creditLimit))
                                .font(.footnote).bold()
                                .accessibilityIdentifier("tgBank.credit.limit")
                        }
                        Spacer()
                        VStack(alignment: .center, spacing: 2) {
                            Text("Available Credit").font(.caption2).foregroundColor(.secondary)
                            Text(String(format: "$%.2f", repository.user.availableCredit))
                                .font(.footnote).bold().foregroundColor(.green)
                                .accessibilityIdentifier("tgBank.credit.available")
                        }
                        Spacer()
                        VStack(alignment: .trailing, spacing: 2) {
                            Text("Used Credit").font(.caption2).foregroundColor(.secondary)
                            Text(String(format: "$%.2f", repository.user.usedCredit))
                                .font(.footnote).bold().foregroundColor(.red)
                                .accessibilityIdentifier("tgBank.credit.used")
                        }
                    }

                    // Next Payment Banner
                    HStack {
                        VStack(alignment: .leading, spacing: 2) {
                            Text("Next Payment Due")
                                .font(.caption2)
                                .foregroundColor(.secondary)
                            Text(String(format: "$%.2f", repository.user.nextPayment))
                                .font(.title3)
                                .bold()
                                .accessibilityIdentifier("tgBank.credit.nextPaymentAmount")
                        }

                        Spacer()

                        Button(action: handleMakePayment) {
                            Text("Pay Now")
                                .font(.caption)
                                .bold()
                                .foregroundColor(.white)
                                .padding(.horizontal, 14)
                                .padding(.vertical, 8)
                                .background(repository.user.nextPayment > 0 ? Color.blue : Color.gray)
                                .cornerRadius(8)
                        }
                        .disabled(repository.user.nextPayment <= 0)
                        .accessibilityIdentifier("tgBank.credit.makePaymentButton")
                    }
                    .padding(10)
                    .background(Color(uiColor: .systemGray6))
                    .cornerRadius(10)
                }
                .padding()
                .background(Color(uiColor: .secondarySystemGroupedBackground))
                .cornerRadius(16)
                .padding(.horizontal)
                .accessibilityIdentifier("tgBank.credit.overviewCard")

                // Messages / Feedback
                if let msg = increaseMessage {
                    HStack {
                        Image(systemName: "checkmark.circle.fill").foregroundColor(.green)
                        Text(msg).font(.caption).foregroundColor(.green)
                    }
                    .padding(.horizontal)
                    .accessibilityIdentifier("tgBank.credit.increaseSuccessMessage")
                }

                if let msg = statementMessage {
                    HStack {
                        Image(systemName: "doc.fill").foregroundColor(.blue)
                        Text(msg).font(.caption).foregroundColor(.blue)
                    }
                    .padding(.horizontal)
                    .accessibilityIdentifier("tgBank.credit.statementSuccessMessage")
                }

                if let err = paymentErrorMessage {
                    Text(err).font(.caption).foregroundColor(.red).padding(.horizontal)
                }

                // Actions: Request Increase, Statements, Apply Loan
                VStack(spacing: 12) {
                    Button(action: handleCreditLimitIncrease) {
                        HStack {
                            Image(systemName: "arrow.up.circle.fill").foregroundColor(.green)
                            Text("Request Credit Limit Increase (+$250k)")
                                .font(.subheadline).bold().foregroundColor(.primary)
                            Spacer()
                            Image(systemName: "chevron.right").font(.caption).foregroundColor(.secondary)
                        }
                        .padding()
                        .background(Color(uiColor: .secondarySystemGroupedBackground))
                        .cornerRadius(12)
                    }
                    .padding(.horizontal)
                    .accessibilityIdentifier("tgBank.credit.requestIncreaseButton")

                    Button(action: handleDownloadStatement) {
                        HStack {
                            Image(systemName: "arrow.down.doc.fill").foregroundColor(.blue)
                            Text("Download Statement (TG_Statement_Aug2026.pdf)")
                                .font(.subheadline).bold().foregroundColor(.primary)
                            Spacer()
                            Image(systemName: "chevron.right").font(.caption).foregroundColor(.secondary)
                        }
                        .padding()
                        .background(Color(uiColor: .secondarySystemGroupedBackground))
                        .cornerRadius(12)
                    }
                    .padding(.horizontal)
                    .accessibilityIdentifier("tgBank.credit.statementsButton")

                    Button(action: {
                        coordinator.isShowingLoanApplication = true
                    }) {
                        HStack {
                            Image(systemName: "signature").foregroundColor(.purple)
                            Text("Apply for Personal Loan / New Card")
                                .font(.subheadline).bold().foregroundColor(.primary)
                            Spacer()
                            Image(systemName: "chevron.right").font(.caption).foregroundColor(.secondary)
                        }
                        .padding()
                        .background(Color(uiColor: .secondarySystemGroupedBackground))
                        .cornerRadius(12)
                    }
                    .padding(.horizontal)
                    .accessibilityIdentifier("tgBank.credit.applyLoanButton")
                }

                // Elite Cards Carousel
                VStack(alignment: .leading, spacing: 10) {
                    Text("Your Elite Metal Cards")
                        .font(.headline)
                        .padding(.horizontal)

                    ForEach(repository.creditCards) { card in
                        CreditCardItemView(card: card)
                    }
                    .padding(.horizontal)
                }

                Spacer().frame(height: 24)
            }
        }
        .background(Color(uiColor: .systemGroupedBackground))
        .navigationTitle("Credit & Loan")
        .sheet(isPresented: $coordinator.isShowingLoanApplication) {
            LoanApplicationView()
        }
        .accessibilityIdentifier("tgBank.credit.screen")
    }

    private func handleCreditLimitIncrease() {
        let res = repository.requestCreditLimitIncrease()
        increaseMessage = res.message
        DispatchQueue.main.asyncAfter(deadline: .now() + 3) {
            increaseMessage = nil
        }
    }

    private func handleDownloadStatement() {
        statementMessage = "Downloaded TG_Statement_Aug2026.pdf successfully."
        DispatchQueue.main.asyncAfter(deadline: .now() + 3) {
            statementMessage = nil
        }
    }

    private func handleMakePayment() {
        let res = repository.payCreditBill()
        if res.success {
            paymentErrorMessage = nil
        } else {
            paymentErrorMessage = res.error
        }
    }
}

struct CreditCardItemView: View {
    let card: EliteCreditCard

    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack {
                Text(card.name)
                    .font(.footnote)
                    .bold()
                    .foregroundColor(.white)
                Spacer()
                Text(card.tier)
                    .font(.caption2)
                    .bold()
                    .foregroundColor(.amberGold)
            }

            Spacer().frame(height: 10)

            Text(card.cardNumber)
                .font(.system(size: 18, weight: .bold, design: .monospaced))
                .foregroundColor(.white)

            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text("CARDHOLDER").font(.system(size: 8)).foregroundColor(.white.opacity(0.7))
                    Text(card.holder).font(.caption).bold().foregroundColor(.white)
                }
                Spacer()
                VStack(alignment: .trailing, spacing: 2) {
                    Text("EXPIRES").font(.system(size: 8)).foregroundColor(.white.opacity(0.7))
                    Text(card.expiry).font(.caption).bold().foregroundColor(.white)
                }
            }

            Text("Perk: \(card.perks)")
                .font(.system(size: 10))
                .foregroundColor(.white.opacity(0.8))
        }
        .padding()
        .frame(maxWidth: .infinity)
        .background(
            LinearGradient(
                colors: [Color.black, Color.gray.opacity(0.8), Color.black],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        )
        .cornerRadius(16)
        .shadow(radius: 6)
    }
}

extension Color {
    static let amberGold = Color(red: 0.95, green: 0.77, blue: 0.3)
}
