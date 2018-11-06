import { Component, OnInit } from '@angular/core';

import {AuthService} from "../../../components/auth/auth.service";
import {Router} from "@angular/router";

import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';


interface User {
  name: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: User = {
    name: '',
    email: '',
    password: '',
  };
  errors = {login: undefined};
  submitted = false;
  AuthService;
  Router;
  toastrService;
  CurrentYear = moment().year();
  
  static parameters = [AuthService, Router, ToastrService];
  constructor(_AuthService_: AuthService, 
              router: Router,
              _toastrService: ToastrService) {
    this.AuthService = _AuthService_;
    this.Router = router;
    this.toastrService = _toastrService;
  }

  ngOnInit(): void {
    this.AuthService.isLoggedIn(loggedIn => {
      if (loggedIn) {
        return this.Router.navigate(['admin/dashboard']);
      }
    });
  }

  login() {    
    
    this.submitted = true;

    return this.AuthService.login({
      email: this.user.email,
      password: this.user.password
    })
      .then(user => {
        if (this.AuthService.isCustomer()) {
          //console.log('user =========' + JSON.stringify(user));
          let currentDate = new Date();
          let subscriptionEndDate = new Date(user.subscription_end_date);
          let subscriptionStartDate = new Date(user.subscription_start_date);
          if (user.status && currentDate.getTime() >= subscriptionStartDate.getTime() && currentDate.getTime() <= subscriptionEndDate.getTime()){
            this.Router.navigate(['customer']);
          } else if (!user.status) {
            this.toastrService.error('Your status is disabled.', 'Error!!', {"positionClass": "toast-bottom-right"});
          } else {
            this.toastrService.error('Your validity date is over.', 'Error!!', {"positionClass": "toast-bottom-right"});
          }
        } else {
          this.toastrService.success('Login successfully.', 'Success!!', {"positionClass": "toast-bottom-right"});
          this.Router.navigate(['admin']);
        }

      })
      .catch(err => {
        console.log(err.message);
        this.errors.login = err.message;
        this.toastrService.error('Email or Password is Incorrect.', 'Error!!', {"positionClass": "toast-bottom-right"});
      });
  }
}
