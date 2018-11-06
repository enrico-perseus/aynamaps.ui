import { NgModule, Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { LocationService } from '../../../../../components/auth/location.service';
import { CustomerService } from "../../../../../components/auth/customer.service";
import { AuthService } from '../../../../../components/auth/auth.service';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-edit-timeslots',
  templateUrl: './edit-timeslots.component.html',
  styleUrls: ['./edit-timeslots.component.css']
})

export class EditTimeslotsComponent implements OnInit {


  toastrService: any;
  locationService: any;
  customerService: any;
  authService: any;
  Router: any;
  currentUser: {};
  route: any;

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
  id  = '';
  is_no_end_date = false;
  
  constructor(private _toastrService: ToastrService,
              private _locationService: LocationService,
              private _customerService: CustomerService,
              private _authService: AuthService,
              private router: Router,
              private _route: ActivatedRoute) {
    this.toastrService = _toastrService;
    this.locationService = _locationService;
    this.customerService = _customerService;
    this.authService = _authService;
    this.Router = router;
    this.route = _route;
    this.id = this.route.snapshot.params['id'];
    console.log("id===========" + this.id);
  }

  is_all_day(){
    console.log(this.timeslot.is_all_day);
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
    this.customerService.editTimeslot(this.timeslot).then(
      res => {                
        self.Router.navigate(['/customer/home', { outlets: { popup: ['timeslots'] } }]);
      },
      err => {
        console.log(err);
        if (err._body != undefined && err._body != null) {
          self.toastrService.error(err._body, 'Error!!', {"positionClass": "toast-bottom-right"});
        } else {
          self.toastrService.error("Failed to edit timeslot.", 'Error!!', {"positionClass": "toast-bottom-right"});
        }
      }
    )
  }
  
  GetTimeSlotList(){
    this.Router.navigate(['/customer/home', { outlets: { popup: ['timeslots'] } }]);
  }
  
  getTimeslot(id) {
    let self = this;
    this.customerService.getTimeslotbyId(id)
    .then(res => {
        self.timeslot = res.json();
        if (self.timeslot.end_date == '') self.is_no_end_date = true;
        console.log(self.timeslot.start_date);
        console.log("timeslot=========" + self.timeslot);

    })
    .catch(err => {
      console.log(err);
      self.toastrService.error("Failed to get customer information.", 'Error!!', {"positionClass": "toast-bottom-right"});
    });
  }
  
  ngOnInit() {
    this.reset();
    let self = this;
    this.authService.currentUserChanged.subscribe(user => {
        self.currentUser = user;
        self.reset();
    });
  }

  reset() {
    let self = this;
    this.authService.getCurrentUser().then(user => {      
      self.currentUser = user;
      self.getTimeslot(this.id);
    });
  }
}
  