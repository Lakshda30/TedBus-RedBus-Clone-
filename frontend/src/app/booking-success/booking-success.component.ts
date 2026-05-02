import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../i18n/language.service';

@Component({
  selector: 'app-booking-success',
  templateUrl: './booking-success.component.html',
  styleUrls: ['./booking-success.component.css']
})
export class BookingSuccessComponent implements OnInit {
  busId: any = '';
  seats: any[] = [];
  today = '';

  constructor(private languageService: LanguageService) {}

  ngOnInit(): void {
    const data = JSON.parse(localStorage.getItem('bookingData') || '{}');

    this.busId = data.busId || 'N/A';
    this.seats = data.seats || [];

    const date = new Date();
    this.today = date.toISOString().split('T')[0];
  }

  downloadTicket(): void {
    alert(this.languageService.translate('bookingSuccess.ticketSoon'));
  }
}
