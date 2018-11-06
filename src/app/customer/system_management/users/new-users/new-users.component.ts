import { NgModule, Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { LocationService } from '../../../../../components/auth/location.service';
import {CustomerService} from "../../../../../components/auth/customer.service";
import { AuthService } from '../../../../../components/auth/auth.service';
import {environment} from '../../../../../environments/environment';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-new-users',
  templateUrl: './new-users.component.html',
  styleUrls: ['./new-users.component.css']
})

export class NewUsersComponent implements OnInit {


  toastrService: any;
  locationService: any;
  customerService: any;
  authService: any;
  Router: any;
  currentUser: {};
  RolesList: {};
  imageModel = "/assets/images/user-top.png";
  file: {};
  basePath = environment.basePath;

  user = {
      customer_id: '',
      name: '',
      password: 'aaaaaa',
      email: '',
      logo: 'assets/images/user-top.png',
      role: 'admin',
      type: 'Internal',
      validity: '1',
      building : 'flat',
      floor: '0',
      location: '',
      building_full: '',
      floor_full: '',
      location_full: '',
      status: true
  }

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

 save() {   
      let self = this;

      if (this.file == null) {
        this.saveData();
      } else {
        this.customerService.uploadUserFile(this.file)
        .then(value => {
          //console.log(JSON.stringify(values));
          console.log(value._body);
          self.user.logo = value._body;
          self.saveData();
        }, err => {
            alert(err);
        });    
      }          
    }
    saveData(){
      let self = this;
    this.user.customer_id = this.currentUser['_id'];
      console.log(this.user);
      this.customerService.createUser(this.user).then(
        res => {                
          self.Router.navigate(['/customer/home', { outlets: { popup: ['users'] } }]);
        },
        err => {
          console.log(err);
          if (err._body != undefined && err._body != null) {
            self.toastrService.error(err._body, 'Error!!', {"positionClass": "toast-bottom-right"});
          } else {
            self.toastrService.error("Failed to create role.", 'Error!!', {"positionClass": "toast-bottom-right"});
          }
        }
      )
    }
    
    GetUserList(){
      this.Router.navigate(['/customer/home', { outlets: { popup: ['users'] } }]);
    }
    
  ngOnInit() {
    this.reset();
    let self = this;
    this.authService.currentUserChanged.subscribe(user => {
        self.currentUser = user;
        self.reset();
    });

    $(document).ready(function () {
      var readURL = function (input) {
          if (input.files && input.files[0]) {
              var reader = new FileReader();
              reader.onload = function (e) {
                  $('.profile-pic').attr('src', e.target['result']);
              }
              reader.readAsDataURL(input.files[0]);
              $('.remove-btn22').css('display', 'table-cell');
          }
      }
      $(".file-upload").on('change', function () {
          console.log('chenge is called');
          console.log(this.files);
          self.readURL(this);
      });
      $(".upload-button").on('click', function () {
          $(".file-upload").click();
      });
      $(".remove-btn22").on('click', function () {
          $('.profile-pic').attr('src', '/assets/images/user-top.png');
          $('.remove-btn22').css('display', 'none');
      });
  }); 
    //this.timeslot.customer_id = self.currentUser['_id'];   
  }

  readURL(input) {    
    console.log(input.files);    
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function(e) {
          $('.profile-pic').attr('src', e.target['result']);
      }
      reader.readAsDataURL(input.files[0]);
      this.file = input.files[0];
    }
  }

  getRoles(){
    let self = this;
    let tt:string;
    this.customerService.getRoles().then(
      res => {                
        self.RolesList = res.json();      
        console.log(tt = this.RolesList[0].role_name);
      },
      err => {        
        self.toastrService.error('Failed to get role list.', 'Error!!', {"positionClass": "toast-bottom-right"});
      }
    )
  }

  reset() {
    let self = this;
    this.authService.getCurrentUser().then(user => {      
      self.currentUser = user;
      //self.loadCategories();
    });
    this.getRoles();
  }
}
