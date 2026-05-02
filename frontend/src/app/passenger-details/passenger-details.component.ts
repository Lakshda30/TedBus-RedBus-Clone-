import { Component } from '@angular/core';

@Component({
  selector: 'app-passenger-details',
  templateUrl: './passenger-details.component.html',
  styleUrls: ['./passenger-details.component.css']
})
export class PassengerDetailsComponent {
  notifications = [
    'passengerDetails.bookingConfirmed',
    'passengerDetails.busDelayed',
    'passengerDetails.newOffer'
  ];
}
