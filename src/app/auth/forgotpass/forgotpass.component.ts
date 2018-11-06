import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../../components/auth/customer.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-forgotpass',
  templateUrl: './forgotpass.component.html',
  styleUrls: ['./forgotpass.component.css']
})
export class ForgotpassComponent implements OnInit {

  myRecaptcha: boolean
  email;
  CurrentYear
  submitted = false;

  customerService;
  toastrService;

  constructor(_customerService: CustomerService,
              _toastrService: ToastrService) {

    this.toastrService = _toastrService;
    this.customerService = _customerService;
  }

  ngOnInit() {
  }

  forgotPass(e) {
    e.preventDefault();
    var self = this;

    this.customerService.forgotPassword(this.email)
    .toPromise()
    .then (     
      res => {
        console.log(res);
        if (res.code == 1) {
            self.toastrService.success(res.message, 'Success!!', {"positionClass": "toast-bottom-right"});

        } else if (res.code == 0) {
          self.toastrService.error(res.message, 'Error!!', {"positionClass": "toast-bottom-right"});
        }        
      },
      err => {
        self.toastrService.error(err, 'Error!!', {"positionClass": "toast-bottom-right"});
      }
    );    
  }

  onScriptLoad() {
    console.log('Google reCAPTCHA loaded and is ready for use!')
  }

  onScriptError() {
      console.log('Something went long when loading the Google reCAPTCHA')
  }
}
