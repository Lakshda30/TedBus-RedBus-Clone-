import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ReviewService } from '../../../../service/review.service';

@Component({
  selector: 'app-bus-box',
  templateUrl: './bus-box.component.html',
  styleUrls: ['./bus-box.component.css']
})
export class BusBoxComponent implements OnInit, OnChanges {
@Input() rating:number[]=[];
@Input() operatorname:string=''
@Input() bustype:string=''
@Input() departuretime:string=""
@Input() reschedulable :number=0
@Input() livetracking: number=0
@Input() filledseats:any[]=[]
@Input() routedetails: any
@Input() busid:string=''
avgrating:number=0
totalreview:number=0
seatprivce:number=0
bustypename:string=''
busdeparturetime:number=0;
busarrivaltime:number=0
isLoadingReviews = false;

constructor(private reviewService: ReviewService){}

ngOnInit(): void{
  this.hydrateStaticBusDetails();
  this.loadReviewSummary();
}

ngOnChanges(changes: SimpleChanges): void {
  if (changes['busid'] && !changes['busid'].firstChange) {
    this.loadReviewSummary();
  }

  if ((changes['rating'] && !changes['rating'].firstChange) || (changes['routedetails'] && !changes['routedetails'].firstChange)) {
    this.hydrateStaticBusDetails();
  }
}

private hydrateStaticBusDetails(): void {
  this.avgrating = 0;
  this.totalreview = 0;
  this.rating.forEach((item,index)=> {
    this.avgrating+=  item;
    this.totalreview += index;
  });
  if(this.totalreview==0){
    this.totalreview=1
  }
  this.avgrating=+this.avgrating/this.totalreview
  // console.log(this.routedetails)
  if(this.bustype ==='standard'){
    this.seatprivce=50 * Math.floor(this.routedetails.duration) /2;
    this.bustypename='standard;'
  }else if(this.bustype ==='sleeper'){
    this.seatprivce=100 * Math.floor(this.routedetails.duration) /2;
    this.bustypename='sleeper;'
  }else if (this.bustype ==='A/C Seater'){
    this.seatprivce=125 * Math.floor(this.routedetails.duration) /2;
    this.bustypename='A/C Seater;'
  }else{
    this.seatprivce=75 * Math.floor(this.routedetails.duration) /2;
    this.bustypename='Non - A/C;'
  }
  const numericvalue=parseInt(this.departuretime,10);
  this.busdeparturetime=numericvalue
  this.busarrivaltime=(numericvalue + this.routedetails.duration) % 24;
}

private loadReviewSummary(): void {
  if (!this.busid) {
    return;
  }

  this.isLoadingReviews = true;
  this.reviewService.getBusReviewSummary(this.busid).subscribe({
    next: (summary) => {
      this.avgrating = summary.averageRating || 0;
      this.totalreview = summary.count || 0;
      this.isLoadingReviews = false;
    },
    error: () => {
      this.isLoadingReviews = false;
    }
  });
}
}
