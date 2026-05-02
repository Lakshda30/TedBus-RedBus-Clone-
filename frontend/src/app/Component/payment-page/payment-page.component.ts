import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { DataserviceService } from '../../service/dataservice.service';
import { BusService } from '../../service/bus.service';
import { AuthService } from '../../service/auth.service';
import { LanguageService } from '../../i18n/language.service';

declare global {
  interface Window {
    Razorpay: any;
  }
}

@Component({
  selector: 'app-payment-page',
  templateUrl: './payment-page.component.html',
  styleUrls: ['./payment-page.component.css']
})
export class PaymentPageComponent implements OnInit {
  selectedPaymentMethod = 'stripe';
  isLoading = false;
  passseatarray: string[] = [];
  passfare = 0;
  routedetails: any = [];
  busdepauturetime = 0;
  busarrivaltime = 0;
  customerid: any = null;
  operatorname = '';
  passengerdetails: any[] = [];
  email = '';
  fare = 0;
  busid = '';
  phonenumber = '';
  departuredetails: any = {};
  arrivaldetails: any = {};
  duration = '';
  isbuisnesstravel = false;
  isinsurance = false;
  iscoviddonated: Boolean = false;
  bookingdate = new Date().toISOString().split('T')[0];
  paymentStatusMessage = '';
  offerCode = '';
  appliedOfferCode = '';
  discountAmount = 0;
  paymentConfig = {
    stripeConfigured: false,
    razorpayConfigured: false
  };
  private readonly paymentFlowStorageKey = 'paymentFlowData';
  private readonly paymentPassengerStorageKey = 'paymentPassengerDetails';
  private readonly paymentRouteStorageKey = 'paymentRouteDetails';
  constructor(
    private route: ActivatedRoute,
    private dataservice: DataserviceService,
    private busservice: BusService,
    private router: Router,
    private authService: AuthService,
    private languageService: LanguageService
  ) {}

  pay(): void {
    if (!this.passseatarray.length) {
      alert(this.languageService.translate('paymentPage.noSeatsSelected'));
      return;
    }

    if (!this.customerid) {
      alert(this.languageService.translate('paymentPage.loginFirst'));
      return;
    }

    if (!this.isMethodAvailable(this.selectedPaymentMethod)) {
      this.paymentStatusMessage = this.languageService.translate('paymentPage.methodNotConfigured', {
        method: this.selectedMethodLabel(this.selectedPaymentMethod)
      });
      return;
    }

    this.paymentStatusMessage = this.languageService.translate('paymentPage.startingCheckout', {
      method: this.selectedMethodDisplayName
    });
    this.isLoading = true;
    this.startCheckout();
  }

  get totalPassengers(): number {
    return this.passengerdetails.length || this.passseatarray.length;
  }

  get insuranceCharge(): number {
    return this.isinsurance ? this.totalPassengers * 15 : 0;
  }

  get subtotalAmount(): number {
    return Number(this.passfare || 0) + this.insuranceCharge;
  }

  get totalAmount(): number {
    return Math.max(this.subtotalAmount - this.discountAmount, 0);
  }

  get payButtonLabel(): string {
    const labels: Record<string, string> = {
      stripe: this.languageService.translate('paymentPage.payWithStripe'),
      card: this.languageService.translate('paymentPage.payWithCard'),
      debit: this.languageService.translate('paymentPage.payWithDebitCard'),
      upi: this.languageService.translate('paymentPage.payWithUpi'),
      wallet: this.languageService.translate('paymentPage.payWithWallet'),
      netbanking: this.languageService.translate('paymentPage.payWithNetbanking')
    };
    return labels[this.selectedPaymentMethod] || this.languageService.translate('paymentPage.payNow');
  }

  get selectedMethodDisplayName(): string {
    const labels: Record<string, string> = {
      stripe: 'Stripe',
      card: this.languageService.translate('paymentPage.creditCard'),
      debit: this.languageService.translate('paymentPage.debitCard'),
      upi: 'UPI',
      wallet: this.languageService.translate('paymentPage.wallets'),
      netbanking: this.languageService.translate('paymentPage.netBanking')
    };
    return labels[this.selectedPaymentMethod] || this.languageService.translate('common.status');
  }

  isMethodAvailable(method: string): boolean {
    if (method === 'stripe') {
      return this.paymentConfig.stripeConfigured;
    }

    return this.paymentConfig.razorpayConfigured;
  }

  getMethodAvailabilityNote(method: string): string {
    if (method === 'stripe') {
      return this.paymentConfig.stripeConfigured ? '' : this.languageService.translate('paymentPage.addStripeKey');
    }

    return this.paymentConfig.razorpayConfigured ? '' : this.languageService.translate('paymentPage.addRazorpayKeys');
  }

  choosePaymentMethod(method: string): void {
    if (!this.isMethodAvailable(method)) {
      this.paymentStatusMessage = this.languageService.translate('paymentPage.methodNotConfiguredServer', {
        method: this.selectedMethodLabel(method)
      });
      return;
    }
    this.selectedPaymentMethod = method;
  }

  private selectedMethodLabel(method: string): string {
    const labels: Record<string, string> = {
      stripe: 'Stripe',
      card: this.languageService.translate('paymentPage.payWithCard'),
      debit: this.languageService.translate('paymentPage.payWithDebitCard'),
      upi: this.languageService.translate('paymentPage.payWithUpi'),
      wallet: this.languageService.translate('paymentPage.payWithWallet'),
      netbanking: this.languageService.translate('paymentPage.payWithNetbanking')
    };
    return labels[method] || this.languageService.translate('paymentPage.payNow');
  }

  applyOfferCode(): void {
    const code = this.offerCode.trim().toUpperCase();
    const offers: Record<string, number> = {
      FIRST10: Math.min(Math.round(this.subtotalAmount * 0.1), 150),
      BUS100: Math.min(100, this.subtotalAmount),
      SAVE50: Math.min(50, this.subtotalAmount)
    };

    if (!code) {
      this.appliedOfferCode = '';
      this.discountAmount = 0;
      this.paymentStatusMessage = this.languageService.translate('paymentPage.enterOfferPrompt');
      return;
    }

    if (!offers[code]) {
      this.appliedOfferCode = '';
      this.discountAmount = 0;
      this.paymentStatusMessage = this.languageService.translate('paymentPage.invalidOffer');
      return;
    }

    this.appliedOfferCode = code;
    this.discountAmount = offers[code];
    this.paymentStatusMessage = this.languageService.translate('paymentPage.offerApplied', {
      code,
      amount: this.discountAmount
    });
  }

  private safeParseStorage(key: string): any {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  }

  private hydrateFallbackData(): void {
    const storedRoute = this.safeParseStorage(this.paymentRouteStorageKey);
    const storedPassengers = this.safeParseStorage(this.paymentPassengerStorageKey);

    if (!this.routedetails && storedRoute) {
      this.routedetails = storedRoute;
    }

    if ((!this.passengerdetails || !this.passengerdetails.length) && Array.isArray(storedPassengers)) {
      this.passengerdetails = storedPassengers;
    }
  }

  ngOnInit(): void {
    const navigationState = window.history.state || {};
    const fallbackState = this.safeParseStorage(this.paymentFlowStorageKey) || {};
    const paymentFlow = navigationState?.selectedseat ? navigationState : fallbackState;

    this.operatorname = paymentFlow.operatorname || '';
    this.passseatarray = Array.isArray(paymentFlow.selectedseat)
      ? paymentFlow.selectedseat
      : typeof paymentFlow.selectedseat === 'string' && paymentFlow.selectedseat
        ? String(paymentFlow.selectedseat).split(',')
        : [];
    this.email = paymentFlow.passemail || '';
    this.phonenumber = paymentFlow.passphn || '';
    this.isbuisnesstravel = paymentFlow.passisbuisness === true || paymentFlow.passisbuisness === 'true';
    this.isinsurance = paymentFlow.passinsurance === true || paymentFlow.passinsurance === 'true';
    this.passfare = Number(paymentFlow.seatprice || 0);
    this.busid = paymentFlow.busid || '';
    this.busarrivaltime = Number(paymentFlow.busarrivaltime || 0);
    this.busdepauturetime = Number(paymentFlow.busdeparturetime || 0);
    this.iscoviddonated = paymentFlow.passiscoviddonate === true || paymentFlow.passiscoviddonate === 'true';
    this.getloggedinuser();

    this.dataservice.currentdata.subscribe(data => {
      if (data) {
        this.routedetails = data;
      }
      this.hydrateFallbackData();
    });

    this.dataservice.passdata.subscribe(data => {
      if (data) {
        this.passengerdetails = data;
      }
      this.hydrateFallbackData();
    });

    this.hydrateFallbackData();
    this.loadPaymentConfig();

    this.route.queryParams.subscribe(params => {
      const paymentState = params['payment'];
      const sessionId = params['session_id'];

      if (paymentState === 'success' && sessionId) {
        this.confirmSuccessfulPayment(sessionId);
      } else if (paymentState === 'cancelled') {
        this.paymentStatusMessage = this.languageService.translate('paymentPage.paymentCancelled');
      }
    });
  }

  private loadPaymentConfig(): void {
    this.busservice.getPaymentConfig().subscribe({
      next: (config) => {
        this.paymentConfig = config;

        if (!config.razorpayConfigured && this.selectedPaymentMethod !== 'stripe') {
          this.selectedPaymentMethod = config.stripeConfigured ? 'stripe' : 'netbanking';
        }

        if (!config.stripeConfigured && !config.razorpayConfigured) {
          this.paymentStatusMessage = this.languageService.translate('paymentPage.gatewayMissing');
        }
      },
      error: () => {
        this.paymentStatusMessage = this.languageService.translate('paymentPage.gatewayConfigUnavailable');
      }
    });
  }

  getloggedinuser(): void {
    const user = this.authService.getAuthUser();
    if (user) {
      this.customerid = user;
    } else {
      this.customerid = null;
      alert(this.languageService.translate('paymentPage.loginContinue'));
    }
  }

  private buildBookingPayload(): any {
    const myBooking: any = {};

    myBooking.customerId = this.customerid._id;
    myBooking.passengerDetails = this.passengerdetails;
    myBooking.email = this.customerid.email;
    myBooking.phoneNumber = this.phonenumber;
    myBooking.fare = this.totalAmount;
    myBooking.status = 'upcoming';
    myBooking.busId = this.busid;
    myBooking.date = this.bookingdate;
    myBooking.operatorName = this.operatorname;
    myBooking.routeId = this.routedetails?._id || this.routedetails?.id || this.busid;

    const date = new Date();
    myBooking.bookingDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    myBooking.seats = this.passseatarray;

    myBooking.departureDetails = {
      city: this.routedetails.departureLocation.name,
      time: this.busdepauturetime,
      date: this.bookingdate
    };

    myBooking.arrivalDetails = {
      city: this.routedetails.arrivalLocation.name,
      time: this.busarrivaltime,
      date: this.bookingdate
    };

    myBooking.duration = this.routedetails.duration;
    myBooking.isBusinessTravel = this.isbuisnesstravel;
    myBooking.isInsurance = this.isinsurance;
    myBooking.isCovidDonated = this.iscoviddonated;
    myBooking.offerCode = this.appliedOfferCode;
    myBooking.discountAmount = this.discountAmount;
    myBooking.selectedPaymentMethod = this.selectedPaymentMethod;
    return myBooking;
  }

  private startCheckout(): void {
    const myBooking = this.buildBookingPayload();

    if (this.selectedPaymentMethod === 'stripe') {
      this.startStripeCheckout(myBooking);
      return;
    }

    this.startRazorpayCheckout(myBooking);
  }

  private startStripeCheckout(myBooking: any): void {
    this.busservice.createCheckoutSession(myBooking).subscribe({
      next: (response) => {
        if (!response?.url) {
          this.isLoading = false;
          this.paymentStatusMessage = this.languageService.translate('paymentPage.stripeUrlMissing');
          return;
        }

        window.location.href = response.url;
      },
      error: (error) => {
        console.error('Checkout session failed', error);
        this.isLoading = false;
        this.paymentStatusMessage = error?.error?.error || this.languageService.translate('paymentPage.stripeStartFailed');
      }
    });
  }

  private startRazorpayCheckout(myBooking: any): void {
    if (!window.Razorpay) {
      this.isLoading = false;
      this.paymentStatusMessage = this.languageService.translate('paymentPage.razorpayScriptMissing');
      return;
    }

    this.busservice.createRazorpayOrder(myBooking).subscribe({
      next: (response) => {
        if (!response?.keyId || !response?.orderId) {
          this.isLoading = false;
          this.paymentStatusMessage = this.languageService.translate('paymentPage.razorpayKeysMissing');
          return;
        }

        try {
          const options = {
            key: response.keyId,
            amount: response.amount,
            currency: response.currency,
            name: 'RedBus Clone',
            description: `${this.selectedMethodDisplayName} payment for bus booking`,
            order_id: response.orderId,
            prefill: {
              name: this.customerid?.name || '',
              email: this.customerid?.email || '',
              contact: this.phonenumber || ''
            },
            notes: {
              operatorName: this.operatorname || '',
              seats: this.passseatarray.join(', ')
            },
            theme: {
              color: '#d84e55'
            },
            handler: (paymentResponse: {
              razorpay_order_id: string;
              razorpay_payment_id: string;
              razorpay_signature: string;
            }) => {
              this.verifyRazorpayPayment(paymentResponse);
            },
            modal: {
              ondismiss: () => {
                this.isLoading = false;
                this.paymentStatusMessage = this.languageService.translate('paymentPage.paymentCancelled');
              }
            }
          };

          this.isLoading = false;
          const razorpay = new window.Razorpay(options);
          razorpay.open();
        } catch (error) {
          console.error('Razorpay open failed', error);
          this.isLoading = false;
          this.paymentStatusMessage = this.languageService.translate('paymentPage.razorpayOpenFailed');
        }
      },
      error: (error) => {
        console.error('Razorpay order failed', error);
        this.isLoading = false;
        this.paymentStatusMessage = error?.error?.error || this.languageService.translate('paymentPage.razorpayStartFailed');
      }
    });
  }

  private verifyRazorpayPayment(paymentResponse: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }): void {
    this.busservice.verifyRazorpayPayment(paymentResponse).subscribe({
      next: () => {
        localStorage.removeItem(this.paymentFlowStorageKey);
        localStorage.removeItem(this.paymentPassengerStorageKey);
        localStorage.removeItem(this.paymentRouteStorageKey);
        this.paymentStatusMessage = this.languageService.translate('paymentPage.paymentSuccessConfirmed');
        this.router.navigate(['/booking-success']);
      },
      error: (error) => {
        console.error('Razorpay verification failed', error);
        this.isLoading = false;
        this.paymentStatusMessage = error?.error?.error || this.languageService.translate('paymentPage.paymentVerificationFailed');
      }
    });
  }

  private confirmSuccessfulPayment(sessionId: string): void {
    if (!this.customerid || this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.busservice.confirmCheckoutSession(sessionId).subscribe({
      next: () => {
        localStorage.removeItem(this.paymentFlowStorageKey);
        localStorage.removeItem(this.paymentPassengerStorageKey);
        localStorage.removeItem(this.paymentRouteStorageKey);
        this.paymentStatusMessage = this.languageService.translate('paymentPage.paymentSuccessConfirmed');
        this.router.navigate(['/booking-success']);
      },
      error: (error) => {
        console.error('Payment confirmation failed', error);
        alert(this.languageService.translate('paymentPage.paymentFailed'));
        this.isLoading = false;
      }
    });
  }
}
