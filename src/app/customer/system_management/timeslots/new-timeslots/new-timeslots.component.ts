import { NgModule, Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import {Router} from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { LocationService } from '../../../../../components/auth/location.service';
import {CustomerService} from "../../../../../components/auth/customer.service";
import { AuthService } from '../../../../../components/auth/auth.service';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-new-timeslots',
  templateUrl: './new-timeslots.component.html',
  styleUrls: ['./new-timeslots.component.css']
})

export class NewTimeslotsComponent implements OnInit {


  toastrService: any;
  locationService: any;
  customerService: any;
  authService: any;
  Router: any;
  currentUser: {};

  timeslot = {
      customer_id: '',
      name: '',
      is_all_day: false,
      sunday: false,
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false, 
      saturday: false,
      start_time: '',
      end_time: '',
      start_date: '',
      end_date: ''
  }

  is_no_end_date = false;

  
  constructor(private _toastrService: ToastrService,
              private _locationService: LocationService,
              private _customerService: CustomerService,
              private _authService: AuthService,
              private router: Router) {
    this.toastrService = _toastrService;
    this.locationService = _locationService;
    this.customerService = _customerService;
    this.authService = _authService;
    this.Router = router;
  }

  is_all_day(){    
    this.timeslot.sunday = !this.timeslot.is_all_day;
    this.timeslot.monday = !this.timeslot.is_all_day;
    this.timeslot.tuesday = !this.timeslot.is_all_day;
    this.timeslot.wednesday = !this.timeslot.is_all_day;
    this.timeslot.thursday = !this.timeslot.is_all_day;
    this.timeslot.friday = !this.timeslot.is_all_day;
    this.timeslot.saturday = !this.timeslot.is_all_day;
  }

  checkday(day){
    let weekName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    this.timeslot.is_all_day  = true;
    if (this.timeslot[day]) this.timeslot.is_all_day = false;
    for (let i = 0; i < weekName.length; i++){
      if (weekName[i] != day && !this.timeslot[weekName[i]]) this.timeslot.is_all_day = false;
    }
  }

 save() {
      let self = this;
      this.timeslot.customer_id = this.currentUser['_id'];
      if (this.is_no_end_date == true) this.timeslot.end_date = '';
      console.log(JSON.stringify(this.timeslot));
      this.customerService.createTimeslot(this.timeslot).then(
        res => {                
          self.Router.navigate(['/customer/home', { outlets: { popup: ['timeslots'] } }]);
        },
        err => {
          console.log(err);
          if (err._body != undefined && err._body != null) {
            self.toastrService.error(err._body, 'Error!!', {"positionClass": "toast-bottom-right"});
          } else {
            self.toastrService.error("Failed to create customer account.", 'Error!!', {"positionClass": "toast-bottom-right"});
          }
        }
      )
    }
    
    GetTimeSlotList(){
      this.Router.navigate(['/customer/home', { outlets: { popup: ['timeslots'] } }]);
    }

  ngOnInit() {
    this.reset();
    let self = this;
    this.authService.currentUserChanged.subscribe(user => {
        self.currentUser = user;
        self.reset();
    }); 
    //this.timeslot.customer_id = self.currentUser['_id'];   
  }

  reset() {
    let self = this;
    this.authService.getCurrentUser().then(user => {      
      self.currentUser = user;
      //self.loadCategories();
    });
  }
}
