import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { Booking } from '../model/booking.model';

type BusSearchResponse = {
  route: any;
  matchedBuses: any[];
  busidwithseatobj: Record<string, any[]>;
  isDemoData?: boolean;
};

const DEMO_ROUTE_RESULTS: Record<string, BusSearchResponse> = {
  'delhi|jaipur': {
    route: {
      _id: 'frontend-demo-route-delhi-jaipur',
      departureLocation: {
        name: 'Delhi',
        subLocations: ['Kashmere Gate', 'Majnu Ka Tila', 'RK Ashram']
      },
      arrivalLocation: {
        name: 'Jaipur',
        subLocations: ['Sindhi Camp', 'Narayan Singh Circle', 'Tonk Road']
      },
      duration: 6
    },
    matchedBuses: [
      {
        _id: 'frontend-demo-bus-delhi-jaipur-1',
        operatorName: 'Royal Travels',
        busType: 'A/C Seater',
        departureTime: '06',
        arrivalTime: '12',
        rating: [4, 5, 4, 5],
        totalSeats: 40,
        routes: 'frontend-demo-route-delhi-jaipur',
        images: 'assets/bus1.png',
        liveTracking: 1,
        reschedulable: 1
      },
      {
        _id: 'frontend-demo-bus-delhi-jaipur-2',
        operatorName: 'City Express',
        busType: 'sleeper',
        departureTime: '21',
        arrivalTime: '03',
        rating: [4, 4, 5],
        totalSeats: 40,
        routes: 'frontend-demo-route-delhi-jaipur',
        images: 'assets/bus2.png',
        liveTracking: 1,
        reschedulable: 0
      }
    ],
    busidwithseatobj: {
      'frontend-demo-bus-delhi-jaipur-1': [3, 7, 18],
      'frontend-demo-bus-delhi-jaipur-2': [1, 2, 10, 16]
    },
    isDemoData: true
  },
  'mumbai|goa': {
    route: {
      _id: 'frontend-demo-route-mumbai-goa',
      departureLocation: {
        name: 'Mumbai',
        subLocations: ['Borivali', 'Dadar', 'Sion']
      },
      arrivalLocation: {
        name: 'Goa',
        subLocations: ['Mapusa', 'Panaji', 'Madgaon']
      },
      duration: 11
    },
    matchedBuses: [
      {
        _id: 'frontend-demo-bus-mumbai-goa-1',
        operatorName: 'Konkan Travels',
        busType: 'sleeper',
        departureTime: '18',
        arrivalTime: '05',
        rating: [5, 4, 4, 5],
        totalSeats: 40,
        routes: 'frontend-demo-route-mumbai-goa',
        images: 'assets/bus3.png',
        liveTracking: 1,
        reschedulable: 1
      },
      {
        _id: 'frontend-demo-bus-mumbai-goa-2',
        operatorName: 'Sea Breeze Bus',
        busType: 'Non A/C',
        departureTime: '20',
        arrivalTime: '07',
        rating: [4, 3, 4],
        totalSeats: 40,
        routes: 'frontend-demo-route-mumbai-goa',
        images: 'assets/bus4.png',
        liveTracking: 0,
        reschedulable: 1
      }
    ],
    busidwithseatobj: {
      'frontend-demo-bus-mumbai-goa-1': [4, 5, 12],
      'frontend-demo-bus-mumbai-goa-2': [8, 11, 20]
    },
    isDemoData: true
  },
  'bangalore|mysore': {
    route: {
      _id: 'frontend-demo-route-bangalore-mysore',
      departureLocation: {
        name: 'Bangalore',
        subLocations: ['Majestic', 'Satellite Bus Stand', 'Electronic City']
      },
      arrivalLocation: {
        name: 'Mysore',
        subLocations: ['Mysore Bus Stand', 'Suburban', 'Nazarbad']
      },
      duration: 4
    },
    matchedBuses: [
      {
        _id: 'frontend-demo-bus-bangalore-mysore-1',
        operatorName: 'Karnataka Express',
        busType: 'standard',
        departureTime: '07',
        arrivalTime: '11',
        rating: [4, 4, 4],
        totalSeats: 40,
        routes: 'frontend-demo-route-bangalore-mysore',
        images: 'assets/bus1.png',
        liveTracking: 1,
        reschedulable: 1
      },
      {
        _id: 'frontend-demo-bus-bangalore-mysore-2',
        operatorName: 'Green Line',
        busType: 'A/C Seater',
        departureTime: '16',
        arrivalTime: '20',
        rating: [5, 4, 5],
        totalSeats: 40,
        routes: 'frontend-demo-route-bangalore-mysore',
        images: 'assets/bus2.png',
        liveTracking: 1,
        reschedulable: 1
      }
    ],
    busidwithseatobj: {
      'frontend-demo-bus-bangalore-mysore-1': [6, 9],
      'frontend-demo-bus-bangalore-mysore-2': [2, 14, 27]
    },
    isDemoData: true
  },
  'kolkata|darjeeling': {
    route: {
      _id: 'frontend-demo-route-kolkata-darjeeling',
      departureLocation: {
        name: 'Kolkata',
        subLocations: ['Esplanade', 'Howrah', 'Karunamoyee']
      },
      arrivalLocation: {
        name: 'Darjeeling',
        subLocations: ['Ghoom', 'Darjeeling Town', 'Chowrasta']
      },
      duration: 12
    },
    matchedBuses: [
      {
        _id: 'frontend-demo-bus-kolkata-darjeeling-1',
        operatorName: 'Himalayan Rider',
        busType: 'sleeper',
        departureTime: '19',
        arrivalTime: '07',
        rating: [4, 5, 4],
        totalSeats: 40,
        routes: 'frontend-demo-route-kolkata-darjeeling',
        images: 'assets/bus3.png',
        liveTracking: 1,
        reschedulable: 0
      },
      {
        _id: 'frontend-demo-bus-kolkata-darjeeling-2',
        operatorName: 'North Bengal Express',
        busType: 'Non A/C',
        departureTime: '20',
        arrivalTime: '08',
        rating: [3, 4, 4],
        totalSeats: 40,
        routes: 'frontend-demo-route-kolkata-darjeeling',
        images: 'assets/bus4.png',
        liveTracking: 0,
        reschedulable: 1
      }
    ],
    busidwithseatobj: {
      'frontend-demo-bus-kolkata-darjeeling-1': [1, 7, 15],
      'frontend-demo-bus-kolkata-darjeeling-2': [9, 10, 22]
    },
    isDemoData: true
  },
  'chennai|pondicherry': {
    route: {
      _id: 'frontend-demo-route-chennai-pondicherry',
      departureLocation: {
        name: 'Chennai',
        subLocations: ['Koyambedu', 'Guindy', 'Tambaram']
      },
      arrivalLocation: {
        name: 'Pondicherry',
        subLocations: ['New Bus Stand', 'Ariyankuppam', 'Beach Road']
      },
      duration: 4
    },
    matchedBuses: [
      {
        _id: 'frontend-demo-bus-chennai-pondicherry-1',
        operatorName: 'East Coast Travels',
        busType: 'A/C Seater',
        departureTime: '08',
        arrivalTime: '12',
        rating: [4, 4, 5],
        totalSeats: 40,
        routes: 'frontend-demo-route-chennai-pondicherry',
        images: 'assets/bus1.png',
        liveTracking: 1,
        reschedulable: 1
      },
      {
        _id: 'frontend-demo-bus-chennai-pondicherry-2',
        operatorName: 'Pondy Express',
        busType: 'standard',
        departureTime: '17',
        arrivalTime: '21',
        rating: [4, 3, 4],
        totalSeats: 40,
        routes: 'frontend-demo-route-chennai-pondicherry',
        images: 'assets/bus2.png',
        liveTracking: 1,
        reschedulable: 1
      }
    ],
    busidwithseatobj: {
      'frontend-demo-bus-chennai-pondicherry-1': [5, 8],
      'frontend-demo-bus-chennai-pondicherry-2': [3, 12, 24]
    },
    isDemoData: true
  }
};

@Injectable({
  providedIn: 'root'
})
export class BusService {
  private readonly bookingsApi = 'http://localhost:5000/api/bookings';
  private readonly busApi = 'http://localhost:5000/api/bus';
  private readonly routesApi = 'http://localhost:5000/api/routes';
  private readonly paymentsApi = 'http://localhost:5000/api/payments';
  private readonly userBookingsApi = 'http://localhost:5000/api/bookings/user/';

  constructor(private http: HttpClient) {}

  private getFallbackRouteResult(depart: string, arrival: string): BusSearchResponse | null {
    const key = `${String(depart).trim().toLowerCase()}|${String(arrival).trim().toLowerCase()}`;
    return DEMO_ROUTE_RESULTS[key] || null;
  }

  // ✅ FIXED
  getMyBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.bookingsApi}/my-bookings`);
  }

  getAllBuses(): Observable<any> {
    return this.http.get(this.busApi);
  }

  GETBUSDETAILS(depart: string, arrival: string, date: string): Observable<BusSearchResponse> {
    return this.http
      .get<BusSearchResponse>(`${this.routesApi}/${depart}/${arrival}/${date}`)
      .pipe(
        catchError((error) => {
          const fallback = this.getFallbackRouteResult(depart, arrival);
          if (fallback) {
            return of(fallback);
          }
          throw error;
        })
      );
  }
  createBooking(data: any): Observable<any> {
    return this.http.post(`${this.bookingsApi}/create`, data);
  }

  cancelBooking(bookingId: string, reason: string): Observable<Booking> {
    return this.http.patch<Booking>(
      `${this.bookingsApi}/${bookingId}/cancel`,
      { reason }
    );
  }

  updateBusSchedule(busId: string, payload: {
    departureTime?: string;
    arrivalTime?: string;
    note?: string;
    effectiveDate?: string;
  }): Observable<any> {
    return this.http.patch(`${this.busApi}/${busId}/schedule`, payload);
  }

  addbusmongo(myBooking: any): Observable<Booking> {
    return this.http.post<Booking>(`${this.bookingsApi}/create`, myBooking);
  }

  createCheckoutSession(booking: any): Observable<{ sessionId: string; url: string }> {
    return this.http.post<{ sessionId: string; url: string }>(`${this.paymentsApi}/checkout-session`, {
      booking
    }).pipe(timeout(10000));
  }

  createRazorpayOrder(booking: any): Observable<{ orderId: string; amount: number; currency: string; keyId: string }> {
    return this.http.post<{ orderId: string; amount: number; currency: string; keyId: string }>(`${this.paymentsApi}/razorpay-order`, {
      booking
    }).pipe(timeout(10000));
  }

  confirmCheckoutSession(sessionId: string): Observable<{ success: boolean; booking: Booking }> {
    return this.http.post<{ success: boolean; booking: Booking }>(`${this.paymentsApi}/confirm-session`, {
      sessionId
    }).pipe(timeout(10000));
  }

  verifyRazorpayPayment(payload: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }): Observable<{ success: boolean; booking: Booking }> {
    return this.http.post<{ success: boolean; booking: Booking }>(`${this.paymentsApi}/razorpay-verify`, payload).pipe(timeout(10000));
  }

  getPaymentConfig(): Observable<{ stripeConfigured: boolean; razorpayConfigured: boolean }> {
    return this.http.get<{ stripeConfigured: boolean; razorpayConfigured: boolean }>(`${this.paymentsApi}/config`).pipe(timeout(5000));
  }

  getbusmongo(id: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.userBookingsApi}${id}`);
  }
}
