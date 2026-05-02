import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  api = "http://localhost:5000/api/bookings";

  constructor(private http: HttpClient) {}

  getBookedSeats(busId: string) {
    return this.http.get(this.api + "/booked-seats/" + busId);
  }

  bookSeats(data: any) {
    return this.http.post(this.api + "/book-seat", data);
  }

}