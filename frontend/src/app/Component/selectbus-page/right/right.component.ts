import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BusService } from '../../../service/bus.service';
import { Bus } from '../../../model/bus.model';
import { Route } from '../../../model/routes.model';
import { LanguageService } from '../../../i18n/language.service';

@Component({
  selector: 'app-right',
  templateUrl: './right.component.html',
  styleUrls: ['./right.component.css']
})
export class RightComponent implements OnInit{
 matchedbus:Bus[]=[]
 routes:any = null
 seats:{[key:string]:any}={}
 loading = false;
 errorMessage = '';

 departurevar:string=''
 arrival:string=''
 date:string=''

 constructor(
  private route:ActivatedRoute,
  private busservice:BusService,
  private languageService: LanguageService
 ){}

 getkeys(){
  return Object.keys(this.seats)
 }

 getBusId(bus: Bus): string {
  return String((bus as any)?._id || '');
 }

 getFilledSeats(bus: Bus): any[] {
  const busId = this.getBusId(bus);
  return this.seats[busId] || [];
 }

 ngOnInit(): void {
   this.route.queryParams.subscribe(params=>{
    const departure=params['departure'] || '';
    const arrival=params['arrival'] || '';
    const date=params['date'] || '';
    this.departurevar=departure
    this.arrival=arrival
    this.date=date

    if (!this.departurevar || !this.arrival || !this.date) {
      this.errorMessage = this.languageService.translate('searchResults.searchDetailsMissing');
      this.matchedbus = [];
      this.routes = null;
      this.seats = {};
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.busservice.GETBUSDETAILS(this.departurevar,this.arrival,this.date).subscribe({
      next: (response:any) => {
        this.matchedbus=response?.matchedBuses || [];
        this.routes=response?.route || null;
        this.seats=response?.busidwithseatobj || {};
        if (!this.matchedbus.length) {
          this.errorMessage = this.languageService.translate('searchResults.noBusesFound');
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Bus search failed', error);
        if (error?.status === 0) {
          this.errorMessage = this.languageService.translate('searchResults.serviceOffline');
        } else {
          this.errorMessage = error?.error?.message || this.languageService.translate('searchResults.loadFailed');
        }
        this.matchedbus = [];
        this.routes = null;
        this.seats = {};
        this.loading = false;
      }
    });
   });
 }

}
