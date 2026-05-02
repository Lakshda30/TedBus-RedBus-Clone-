import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-trip',
  templateUrl: './my-trip.component.html',
  styleUrls: ['./my-trip.component.css']
})
export class MyTripComponent implements OnInit {
  @Input() booking: any[] = [];
  randomimage = '';

  readonly imageArr = [
    'https://s3-ap-southeast-1.amazonaws.com/rb-plus/BI/APP/IND/WM/2323/1087/GW/DL/6fNUIf.jpeg',
    'https://s3-ap-southeast-1.amazonaws.com/rb-plus/BI/APP/IND/WM/9365/1087/GW/DL/hDsqel.jpeg',
    'https://s3-ap-southeast-1.amazonaws.com/rb-plus/BI/APP/IND/WM/10/411/ST/L/penRe7.jpeg',
    'https://s3-ap-southeast-1.amazonaws.com/rb-plus/BI/APP/IND/WM/19449/814/FR/DL/PuizKJ.jpeg'
  ];

  ngOnInit(): void {
    const randomIndex = Math.floor(Math.random() * this.imageArr.length);
    this.randomimage = this.imageArr[randomIndex];
  }
}
