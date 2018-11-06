import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../components/auth/auth.service";
import { CustomerService } from '../../../components/auth/customer.service';
import { Router } from '@angular/router';

import {environment} from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {

  name: any
  OldPassword: any
  NewPassword: any
  ConfirmPassword: any
  currentUser = {
    avatar: ''
  };
  
  file: any

  basePath = environment.basePath;

  authService: AuthService;  
  customerService: CustomerService;
  router :Router;
  toastrService: ToastrService;
  


  constructor(private _authService: AuthService,
              private _customerService: CustomerService,
              private _router: Router,
              private _toastrService: ToastrService) {

    this.authService = _authService;
    this.customerService = _customerService;
    this.router = _router;
    this.toastrService = _toastrService;
    this.reset();
    
    this.authService.currentUserChanged.subscribe(user => {
      this.currentUser = user;
      this.reset();
    });
  }

  ngOnInit() {
    let self = this;
    $(document).ready(function() {
      $(".file-upload").on('change', function() {
        self.readURL(this);
      });
    });
  }

  reset() {
    let self = this;
    this.authService.getCurrentUser().then(user => {      
      self.currentUser = user;
      self.name = self.currentUser['name'];
    });
  }

  openFileBrowser() {
    alert("open file browser");
  }

  pickFile() {
    $(".file-upload").click();
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

  save() {
    if (this.name == '') {
      this.toastrService.error('Please enter name.', 'Error!!', {"positionClass": "toast-bottom-right"});
      return;
    }

    if (this.OldPassword == '' && this.NewPassword != '') {
      this.toastrService.error('Please enter the old password.', 'Error!!', {"positionClass": "toast-bottom-right"});
      return;
    }

    if (this.NewPassword != '' && this.NewPassword != this.ConfirmPassword ) {
      this.toastrService.error('Please enter valid new password.', 'Error!!', {"positionClass": "toast-bottom-right"});
      return;
    }

    if (this.file == null) {
      this.saveProfileInfo(this.currentUser['avatar']);
    } else {
      let self = this;
      this.customerService.uploadFile(this.file)
      .then(value => {
        //console.log(JSON.stringify(values));
        console.log(value._body);
        self.saveProfileInfo(value._body);
      }, err => {
          alert(err);
      });    
    }
  }

  saveProfileInfo(avatarUrl) {
    if (this.OldPassword == undefined) {
      this.OldPassword = '';
    }

    if (this.NewPassword == undefined) {
      this.NewPassword = '';
    }
    let self = this;
    this.authService.changePassword(this.name, this.OldPassword, this.NewPassword, avatarUrl, function(err) {
        if (err == null) {
          self.authService.getCurrentUser().then(user => {
            self.currentUser = user;
            self.router.navigate(['admin/dashboard']);
          });
        } else {
          self.toastrService.error('The old password is invalid.', 'Error!!', {"positionClass": "toast-bottom-right"});
        }
    });
  }

  removeAvatar() {
    this.file = null;    
    this.currentUser['avatar'] = 'assets/uploads/default_profile.png';
  }
}
