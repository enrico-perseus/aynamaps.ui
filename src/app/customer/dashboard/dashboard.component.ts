import { Component, OnInit } from '@angular/core';
import { SlideInOutAnimation } from '../../shared/animations';
import { CustomerService } from "../../../components/auth/customer.service";
import { LocationService } from '../../../components/auth/location.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../../components/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [SlideInOutAnimation]
})
export class DashboardComponent implements OnInit {

  customerData = {
    validity_start_date: new Date(),
    validity_end_date: new Date()
  }

  currentUser = {};
  categories = [];

  datePipe = new DatePipe('en-US');

  te2 = 9000;

  dataSource = [
    { date: '00:00', yield: Math.floor((Math.random() * (this.te2+10)) + 999) },
    { date: '01:00', yield: Math.floor((Math.random() * (this.te2+10)) + 999) },
    { date: '02:00', yield: Math.floor((Math.random() * (this.te2+10)) + 999) },
    { date: '03:00', yield: Math.floor((Math.random() * (this.te2+10)) + 999) },
    { date: '04:00', yield: Math.floor((Math.random() * (this.te2+10)) + 999) },
    { date: '05:00', yield: Math.floor((Math.random() * (this.te2+10)) + 999) },
    { date: '06:00', yield: Math.floor((Math.random() * (this.te2+10)) + 999) },
    { date: '07:00', yield: Math.floor((Math.random() * (this.te2+10)) + 999) },
    { date: '08:00', yield: Math.floor((Math.random() * (this.te2+10)) + 999) },
    { date: '09:00', yield: Math.floor((Math.random() * (this.te2+10)) + 999) },
    { date: '10:00', yield: Math.floor((Math.random() * (this.te2+10)) + 999) },
    { date: '11:00', yield: Math.floor((Math.random() * (this.te2+10)) + 999) },
    { date: '12:00', yield: Math.floor((Math.random() * (this.te2+10)) + 999) },
    { date: '13:00', yield: Math.floor((Math.random() * (this.te2+10)) + 999) },
    { date: '14:00', yield: Math.floor((Math.random() * (this.te2+10)) + 999) },
    { date: '15:00', yield: Math.floor((Math.random() * (this.te2+10)) + 999) },
    { date: '16:00', yield: Math.floor((Math.random() * (this.te2+10)) + 999) },
    { date: '17:00', yield: Math.floor((Math.random() * (this.te2+10)) + 999) },
    { date: '18:00', yield: Math.floor((Math.random() * (this.te2+10)) + 999) },
    { date: '19:00', yield: Math.floor((Math.random() * (this.te2+10)) + 999) },
    { date: '20:00', yield: Math.floor((Math.random() * (this.te2+10)) + 999) },
    { date: '21:00', yield: Math.floor((Math.random() * (this.te2+10)) + 999) }  
  ];

  Tops = [
    { name: 'BaiLang', rand: 1076 },
    { name: 'Toilet',  rand: 920 },
    { name: 'Ketchin', rand: 813 },
    { name: 'Shieck Rashid Tower',  rand: 724 },
    { name: 'Parking', rand: 481 }  
  ];

  Bottoms = [
    { name: 'Ibis Hotel', rand: 75 },
    { name: 'Zaabeel Majlis',  rand: 111 },
    { name: 'Ketchin', rand: 139 },
    { name: 'Zaabeel Hall 2',  rand: 206 },
    { name: 'Zaabeel Hall 3', rand: 331 }  
  ];

  populationByRegions = [{
        region: "CategoryData",
        val: 1
    }];

  topDestinations = [];
  bottomDestinations= [];

  authService: AuthService;
  locationService: LocationService;
  customerService: CustomerService;
  toastrService: ToastrService; 


  validityStartDateChanged(){

  }

  
  constructor(private _toastrService: ToastrService,
              private _router: Router,
              private _customerService: CustomerService,
              private _authService: AuthService,
              private _locationService: LocationService ) {
    this.authService = _authService;
    this.toastrService = _toastrService; 
    this.customerService = _customerService;
    this.locationService = _locationService;
  }

  ngOnInit() {
    let self = this;
    self.reset();
    this.authService.currentUserChanged.subscribe(user =>{
      self.currentUser = user;
      self.reset();
    });
    this.getTopDestinations();
    this.getBottomDestinations();
          
  }

  reset(){
    let self = this;
    this.authService.getCurrentUser().then(user => {
      self.currentUser = user;
      self.loadCategories();
    });
  }

  loadCategories(){
    let self = this;
    this.locationService.getCategory().toPromise()
    .then(
      categories => {
        self.categories = categories;
        console.log("category data=======" + JSON.stringify(self.categories));
        if (self.categories.length > 0){
          self.populationByRegions = [];
          for (let i = 0; i < self.categories.length; i++){
            if (self.categories[i].usage.use_number == null) self.categories[i].usage.use_number = 0;
            self.populationByRegions.push ({
              region: self.categories[i].name + '(' + self.categories[i].usage.use_number + ')',
              val: self.categories[i].usage.use_number
            });
          }
        }
      },
      err => {
        console.log(err);
      }
    )
  }

  filterGraph(){

    console.log("filterGraph entered");
    var dateStartFrom  = this.datePipe.transform(this.customerData.validity_start_date, 'dd/MM/yyyy');
    var dateEndTo  = this.datePipe.transform(this.customerData.validity_end_date, 'dd/MM/yyyy');
    let sp_start:any = dateStartFrom.split('/');
    let sp_end: any = dateEndTo.split('/');

    
    var timeDiff = this.customerData.validity_end_date.getTime() - this.customerData.validity_start_date.getTime();
    var dayDiff = timeDiff / (1000 * 3600 * 24);

    
    
    this.dataSource = [];
    if( dayDiff <1){
        for (var i = 0; i < 24; i++) {
            let dataSourcetemp = {
              date: ('0' + i).slice(-2) + ":00",
              yield: Math.floor((Math.random() * (this.te2+10)) + 999) 
            }
            this.dataSource.push(dataSourcetemp);
        }
    }else if( dayDiff == 1){
        for (var i = 0; i < 4; i++) {
            this.dataSource.push({date: dateStartFrom + ' '+ ('0' + ( i * 6 ) % 24).slice(-2) + ":00", yield: Math.floor((Math.random() * (this.te2 + 10)) + 999)})
        }
        for (var i = 0; i < 4; i++) {
            this.dataSource.push({date: dateEndTo + ' ' + ('0' + ( i * 6 ) % 24).slice(-2) + ":00", yield: Math.floor((Math.random() * (this.te2 + 10)) + 999)})
        }
    }else if(dayDiff == 2){
        for (var i = 0; i < 2; i++) {
            this.dataSource.push({date: dateStartFrom + ' ' + ('0' + ( i * 12 ) % 24).slice(-2)+":00", yield: Math.floor((Math.random() * (this.te2 + 10)) + 999)})
        }
        for (var i = 0; i < 2; i++) {
            this.dataSource.push({date: (parseInt(sp_start[0])+1)+'/'+(parseInt(sp_start[1]))+'/'+sp_start[2]+' '+('0' + (i*12)%24).slice(-2)+":00", yield: Math.floor((Math.random() * (this.te2 + 10)) + 999)})
        }
        for (var i = 0; i < 2; i++) {

            this.dataSource.push({date: dateEndTo + ' '+('0' + (i*12)%24).slice(-2)+":00", yield: Math.floor((Math.random() * (this.te2 + 10)) + 999)})
        }
    }else{
        var i =0;
        for (var j = dayDiff ; j >= 0; j--) {
            var tempdate  = new Date(sp_start[2], sp_start[1]-1, parseInt(sp_start[0])+i );
            this.dataSource.push({date: tempdate.getDate()+'/'+(tempdate.getMonth()+1)+'/'+tempdate.getFullYear(), yield: Math.floor((Math.random() * (this.te2 + 10)) + 999)})
            i++
        }
    }


  } 
  
  getTopDestinations(){
    let self = this;
    this.customerService.getTopDestinations().then(
      res => {
        self.topDestinations = res.json();
        for (let i = 0; i < self.topDestinations.length; i ++){
          self.topDestinations[i].rand = Math.floor((Math.random() * 100) + (10-i) * 111); 
        }
        console.log(this.topDestinations);
      },
      err => {
        self.toastrService.error('Failed to get destinations list', 'Error!!', {"positionClass": "toast-bottom-right"});
      }
    )
  }

  getBottomDestinations(){
    let self = this;
    this.customerService.getBottomDestinations().then(
      res => {
        self.bottomDestinations = res.json();
        for (let i = 0; i < self.bottomDestinations.length; i ++){
          self.bottomDestinations[i].rand = Math.floor((Math.random() * 100) + (i+1) * 111); 
        }
        console.log(this.bottomDestinations);
      },
      err => {
        self.toastrService.error('Failed to get destinations list', 'Error!!', {"positionClass": "toast-bottom-right"});
      }
    )
  }
}
