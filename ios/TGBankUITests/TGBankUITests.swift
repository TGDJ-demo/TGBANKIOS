import XCTest

final class TGBankUITests: XCTestCase {
    var app: XCUIApplication!

    override func setUpWithError() throws {
        continueAfterFailure = false
        app = XCUIApplication()
        app.launch()
    }

    /// Test 1: Full Authentication flow with demo credentials
    func testAuthenticationFlow() throws {
        let usernameField = app.textFields["tgBank.login.usernameField"]
        XCTAssertTrue(usernameField.waitForExistence(timeout: 5))

        let demoButton = app.buttons["tgBank.login.demoCredentialsButton"]
        demoButton.tap()

        let signInButton = app.buttons["tgBank.login.signInButton"]
        signInButton.tap()

        // Verify Home screen loaded
        let homeScreen = app.descendants(matching: .any)["tgBank.home.screen"]
        XCTAssertTrue(homeScreen.waitForExistence(timeout: 5))
    }

    /// Test 2: Send Money 3-step workflow with Beneficiary selection
    func testSendMoneyWorkflow() throws {
        // Authenticate first
        app.buttons["tgBank.login.demoCredentialsButton"].tap()
        app.buttons["tgBank.login.signInButton"].tap()

        // Tap Send Money
        let sendButton = app.buttons["tgBank.home.sendMoneyButton"]
        XCTAssertTrue(sendButton.waitForExistence(timeout: 5))
        sendButton.tap()

        // Verify Step 1 Details
        let benAarav = app.buttons["tgBank.sendMoney.beneficiary.BEN001"]
        XCTAssertTrue(benAarav.waitForExistence(timeout: 3))
        benAarav.tap()

        // Select quick amount $50k
        let quick50k = app.buttons["tgBank.sendMoney.quickAmount.50000"]
        quick50k.tap()

        // Tap Continue
        let continueBtn = app.buttons["tgBank.sendMoney.continueButton"]
        continueBtn.tap()

        // Step 2 Review
        let reviewCard = app.otherElements["tgBank.sendMoney.reviewCard"]
        XCTAssertTrue(reviewCard.waitForExistence(timeout: 3))

        let authBtn = app.buttons["tgBank.sendMoney.authorizationButton"]
        authBtn.tap()

        // Step 3 Payment Authorization Modal
        let mpinField = app.secureTextFields["tgBank.paymentAuth.mpinField"]
        if mpinField.waitForExistence(timeout: 2) {
            mpinField.tap()
            mpinField.typeText("1234")
            app.buttons["tgBank.paymentAuth.mpinVerifyButton"].tap()
        }

        // Verify Success Card
        let successCard = app.otherElements["tgBank.sendMoney.successCard"]
        XCTAssertTrue(successCard.waitForExistence(timeout: 5))
        app.buttons["tgBank.sendMoney.successDoneButton"].tap()
    }

    /// Test 3: UPI Demo Payment flow
    func testUpiDemoPaymentFlow() throws {
        app.buttons["tgBank.login.demoCredentialsButton"].tap()
        app.buttons["tgBank.login.signInButton"].tap()

        // Navigate to UPI Tab
        app.buttons["tgBank.tab.payments"].tap()

        let demoStore = app.buttons["tgBank.upi.demoMerchant1"]
        XCTAssertTrue(demoStore.waitForExistence(timeout: 3))
        demoStore.tap()

        // Pay
        app.buttons["tgBank.upi.payButton"].tap()

        // Verify Success
        let successTitle = app.staticTexts["tgBank.upi.successTitle"]
        XCTAssertTrue(successTitle.waitForExistence(timeout: 5))
        XCTAssertEqual(successTitle.label, "Payment Successful")
    }

    /// Test 4: Dynamic Loan EMI Calculation and Instant Approval
    func testLoanApplicationFlow() throws {
        app.buttons["tgBank.login.demoCredentialsButton"].tap()
        app.buttons["tgBank.login.signInButton"].tap()

        app.buttons["tgBank.tab.credit"].tap()

        let applyLoanBtn = app.buttons["tgBank.credit.applyLoanButton"]
        applyLoanBtn.tap()

        let preset25k = app.buttons["tgBank.loan.preset.25000"]
        XCTAssertTrue(preset25k.waitForExistence(timeout: 3))
        preset25k.tap()

        let submitBtn = app.buttons["tgBank.loan.submitButton"]
        submitBtn.tap()

        let approvalTitle = app.staticTexts["tgBank.loan.approvalTitle"]
        XCTAssertTrue(approvalTitle.waitForExistence(timeout: 3))
        XCTAssertEqual(approvalTitle.label, "Application Approved")
    }

    /// Test 5: KYC Multi-step Wizard verification
    func testKYCWizardFlow() throws {
        app.buttons["tgBank.login.demoCredentialsButton"].tap()
        app.buttons["tgBank.login.signInButton"].tap()

        app.buttons["tgBank.home.kycButton"].tap()

        // Step 1
        app.buttons["tgBank.kyc.step1.nextButton"].tap()

        // Step 2
        app.buttons["tgBank.kyc.uploadDocumentButton"].tap()
        app.buttons["tgBank.kyc.step2.nextButton"].tap()

        // Step 3
        app.buttons["tgBank.kyc.step3.nextButton"].tap()

        // Step 4
        app.buttons["tgBank.kyc.simulateSelfieButton"].tap()
        app.buttons["tgBank.kyc.step4.nextButton"].tap()

        // Step 5
        app.buttons["tgBank.kyc.submitButton"].tap()

        // Step 6
        let completed = app.staticTexts["tgBank.kyc.completedTitle"]
        XCTAssertTrue(completed.waitForExistence(timeout: 3))
        XCTAssertEqual(completed.label, "KYC Completed Successfully")
    }

    /// Test 6: Test Controls and Reset Demo Data
    func testTestControlsAndReset() throws {
        app.buttons["tgBank.login.demoCredentialsButton"].tap()
        app.buttons["tgBank.login.signInButton"].tap()

        app.buttons["tgBank.navigation.testControlsButton"].tap()

        let resetBtn = app.buttons["tgBank.testControls.resetDemoDataButton"]
        XCTAssertTrue(resetBtn.waitForExistence(timeout: 3))
        resetBtn.tap()

        // Must return immediately to Login Screen
        let loginScreen = app.descendants(matching: .any)["tgBank.login.screen"]
        XCTAssertTrue(loginScreen.waitForExistence(timeout: 5))
    }
}
