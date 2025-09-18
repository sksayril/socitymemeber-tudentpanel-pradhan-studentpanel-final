// Razorpay integration utility
declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: any) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: {
    [key: string]: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

class RazorpayService {
  private isLoaded = false;
  private loadPromise: Promise<void> | null = null;

  private loadRazorpayScript(): Promise<void> {
    if (this.isLoaded) {
      return Promise.resolve();
    }

    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        this.isLoaded = true;
        resolve();
      };
      script.onerror = () => {
        reject(new Error('Failed to load Razorpay script'));
      };
      document.head.appendChild(script);
    });

    return this.loadPromise;
  }

  async openPaymentModal(options: RazorpayOptions): Promise<void> {
    try {
      await this.loadRazorpayScript();
      
      if (!window.Razorpay) {
        throw new Error('Razorpay not available');
      }

      const razorpay = new window.Razorpay({
        key: options.key,
        amount: options.amount,
        currency: options.currency,
        name: options.name,
        description: options.description,
        order_id: options.order_id,
        handler: options.handler,
        prefill: options.prefill || {},
        notes: options.notes || {},
        theme: {
          color: options.theme?.color || '#7c3aed',
        },
        modal: {
          ondismiss: options.modal?.ondismiss || (() => {
            console.log('Payment modal dismissed');
          }),
        },
      });

      razorpay.open();
    } catch (error) {
      console.error('Error opening Razorpay payment modal:', error);
      throw error;
    }
  }

  async verifyPaymentSignature(
    orderId: string,
    paymentId: string,
    signature: string,
    _secret: string
  ): Promise<boolean> {
    try {
      // In a real implementation, this verification should be done on the server side
      // For now, we'll return true as a placeholder
      console.log('Verifying payment signature:', { orderId, paymentId, signature });
      return true;
    } catch (error) {
      console.error('Error verifying payment signature:', error);
      return false;
    }
  }

  formatAmount(amount: number): number {
    // Razorpay expects amount in paise (smallest currency unit)
    // For INR, 1 rupee = 100 paise
    return Math.round(amount * 100);
  }

  formatCurrency(currency: string = 'INR'): string {
    return currency.toUpperCase();
  }
}

export const razorpayService = new RazorpayService();

// Razorpay configuration
export const RAZORPAY_CONFIG = {
  // These should be environment variables in production
  keyId: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_EZUuxiOqrDJuQ4',
  keySecret: import.meta.env.VITE_RAZORPAY_KEY_SECRET || '8QSpnXzW7V9jX14YVSJtVwQH',
  currency: 'INR',
  theme: {
    color: '#7c3aed', // Purple theme to match the app
  },
};

export default razorpayService;
