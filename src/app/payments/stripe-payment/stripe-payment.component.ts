import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { PaymentService } from '../payment.service';
import { PaymentType } from '../models/payment.models';

declare var Stripe: any; // Stripe.js library

@Component({
  selector: 'app-stripe-payment',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule
  ],
  templateUrl: './stripe-payment.component.html',
  styleUrls: ['./stripe-payment.component.scss']
})
export class StripePaymentComponent implements OnInit {
  stripe: any;
  elements: any;
  cardElement: any;

  processing = false;
  paymentError: string | null = null;
  paymentSuccess = false;

  amount: number;
  currency: string;
  jobId: string;
  jobTitle: string;
  paymentType: PaymentType;

  constructor(
    public dialogRef: MatDialogRef<StripePaymentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private paymentService: PaymentService
  ) {
    this.amount = data.amount;
    this.currency = data.currency;
    this.jobId = data.jobId;
    this.jobTitle = data.jobTitle;
    this.paymentType = data.paymentType;
  }

  ngOnInit(): void {
    this.initializeStripe();
  }

  initializeStripe(): void {
    // Load Stripe.js from CDN if not already loaded
    if (typeof Stripe === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.onload = () => {
        this.setupStripe();
      };
      document.head.appendChild(script);
    } else {
      this.setupStripe();
    }
  }

  setupStripe(): void {
    // Initialize Stripe with your publishable key
    const publishableKey = this.paymentService.getStripePublishableKey();
    this.stripe = Stripe(publishableKey);

    // Create Elements instance
    this.elements = this.stripe.elements();

    // Create and mount Card Element
    const style = {
      base: {
        fontSize: '16px',
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    };

    this.cardElement = this.elements.create('card', { style });

    // Wait for the DOM to be ready
    setTimeout(() => {
      const cardElementContainer = document.getElementById('card-element');
      if (cardElementContainer) {
        this.cardElement.mount('#card-element');

        // Handle real-time validation errors
        this.cardElement.on('change', (event: any) => {
          if (event.error) {
            this.paymentError = event.error.message;
          } else {
            this.paymentError = null;
          }
        });
      }
    }, 100);
  }

  async processPayment(): Promise<void> {
    this.processing = true;
    this.paymentError = null;

    try {
      // Step 1: Create payment intent
      const paymentIntent = await this.paymentService.createPaymentIntent({
        jobId: this.jobId,
        amount: this.amount,
        currency: this.currency,
        paymentMethod: 'STRIPE' as any,
        paymentType: this.paymentType,
        description: `Payment for ${this.jobTitle}`
      }).toPromise();

      if (!paymentIntent) {
        throw new Error('Failed to create payment intent');
      }

      // Step 2: Confirm payment with Stripe
      const result = await this.stripe.confirmCardPayment(paymentIntent.clientSecret, {
        payment_method: {
          card: this.cardElement,
          billing_details: {
            name: 'Customer Name' // In production, get from auth service
          }
        }
      });

      if (result.error) {
        // Show error to customer
        this.paymentError = result.error.message;
        this.processing = false;
      } else {
        // Payment succeeded
        if (result.paymentIntent.status === 'succeeded') {
          // Create escrow payment record
          await this.paymentService.createEscrowPayment({
            jobId: this.jobId,
            amount: this.amount,
            currency: this.currency,
            paymentMethod: 'STRIPE' as any,
            paymentType: this.paymentType,
            description: `Payment for ${this.jobTitle}`
          }).toPromise();

          this.paymentSuccess = true;
          this.processing = false;

          // Close dialog after short delay
          setTimeout(() => {
            this.dialogRef.close({ success: true, paymentIntent: result.paymentIntent });
          }, 2000);
        }
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      this.paymentError = error.message || 'Payment failed. Please try again.';
      this.processing = false;
    }
  }

  cancel(): void {
    this.dialogRef.close({ success: false });
  }
}
