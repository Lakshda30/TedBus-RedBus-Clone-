export interface Booking {
  customerId: string;
  passengerDetails: any[];
  email: string;
  phoneNumber: string;
  fare: number;
  status: string;
  bookingDate: string;
  busId: string;
  seats: number[];
  departureDetails: any;
  arrivalDetails: any;

  // 🔥 extra fields (jo tum use kar rahi ho)
  duration?: string;
  routeName?: string;
  date?: string;
  isBusinessTravel?: boolean;
  isInsurance?: boolean;
  isCovidDonated?: boolean;

  _id?: string;
}

  
  interface Passenger {
    name: string;
    gender: string;
    age: number;
  }
  
  interface TripDetails {
    city: string;
    location: string;
    time: number | string;
  }
  
  interface BusinessDetails {
    gst?: string;
    name?: string;
    address?: string;
    email?: string;
  }
  