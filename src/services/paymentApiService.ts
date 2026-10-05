import { TestControlState } from '../types';

export class PaymentAPIService {
  private static baseUrl = 'https://api.demo.tgbank.internal/v1';

  public static async executePaymentCall(
    endpoint: string,
    payload: Record<string, unknown>,
    controls: TestControlState,
    balance: number,
    amount: number
  ): Promise<{ success: boolean; error?: string; referenceId?: string }> {
    // 1. Simulate Network latency
    await new Promise((resolve) => setTimeout(resolve, 600));

    // 2. Check Simulated Network Timeout
    if (controls.simulateNetworkTimeout) {
      return {
        success: false,
        error: 'Simulated network timeout. Please check your connection.',
      };
    }

    // 3. Check Insufficient Balance
    if (controls.forceInsufficientBalance || balance < amount) {
      return {
        success: false,
        error: 'Insufficient demo balance.',
      };
    }

    // 4. Check Transaction Failure
    if (controls.forceTransactionFailure) {
      if (endpoint.includes('upi')) {
        return {
          success: false,
          error: 'UPI payment rejected by simulated payment switch.',
        };
      }
      return {
        success: false,
        error: 'Transaction failed: Simulated bank network rejection.',
      };
    }

    // Success response
    const ref = `REF-${Math.floor(10000000 + Math.random() * 90000000)}`;
    return {
      success: true,
      referenceId: ref,
    };
  }
}
