import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../components/auth/auth.service';
import { CustomerService } from '../../../../components/auth/customer.service';
import { ToastrService } from 'ngx-toastr';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['../../customer.item.edit.css',
              './settings.component.css']
})
export class SettingsComponent implements OnInit {

  settingData = {
    kioskStatus : true,
    kioskEmail : []
  }
  currentUser = {};
  userInfo = {
    _id: '',
    uid: '',
    license_type: '',
    is_user_unlimited: false,
    user_value: '',
    account_type: '',
    subscription_type: '',
    subscription_start_date: '',
    subscription_end_date: '',
    validity_end_date: ''
  };
  authService: AuthService;
  customerService: CustomerService;
  toastrService: ToastrService;
  languages = [];
  receivedEmail = '';
  isUpdate = false;
  kioskYes = true;
  kioskNo = false; 

  constructor(private _authService: AuthService,
              private _customerService: CustomerService,
              private _toastrService: ToastrService) { 
    this.authService = _authService;
    this.customerService = _customerService;
    this.toastrService = _toastrService;
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
      //console.log("user==== " + JSON.stringify(user));
      if (user._id != ""){
        self.customerService.get({id: user._id}).subscribe(res =>{
          self.userInfo = res;
          console.log(self.userInfo);
        });

        self.customerService.getNASetting({id: user._id}).then(res =>{
          self.settingData = res.json();
          self.kioskYes = self.settingData.kioskStatus;
          self.kioskNo =  !self.settingData.kioskStatus;
          self.isUpdate = true;
        },
        err => {
          self.isUpdate = false;
        })
      
        for (let i = 0; i < self.currentUser['language'].length; i++){
          self.languages.push({displayValue: self.currentUser['language'][i].language});
        }
      }      
    });
  }

  addEmail() {
    let self = this;
    if (self.receivedEmail == ""){
        self.toastrService.error('Please insert kiosk received email.', 'Error!!', {"positionClass": "toast-bottom-right"});
    } else {
        this.settingData.kioskEmail.push({
            email: self.receivedEmail        
        });
        self.receivedEmail = "";        
    }
  }

  removeEmail(email) {
      console.log(email);
      let temp = [];
      for (let i = 0; i < this.settingData.kioskEmail.length; i++){
          if (this.settingData.kioskEmail[i].email != email.email){
            temp.push(this.settingData.kioskEmail[i]);
          }
      }
      this.settingData.kioskEmail = temp;
  }

  kioskCheck(value){
    if (value == 'yes'){
      this.kioskNo = this.kioskYes;
      this.kioskYes = this.kioskYes;
    } else {
      this.kioskNo = this.kioskNo;
      this.kioskYes = this.kioskNo;
    }
  }

  save(){
    let self = this;
    this.settingData.kioskStatus = this.kioskYes; 
    console.log(this.settingData);
    if (this.settingData.kioskEmail.length > 0){
      if (this.isUpdate) {
        this.update();
      } else {
        this.create();
      }
    } else {
        this.toastrService.error("The kiosk email is required", 'Error!!', {"positionClass": "toast-bottom-right"});
    }   
  }


create(){
  let self = this;
  this.customerService.createNASetting(this.settingData).then(
    res => {                
      self.toastrService.success("Successfully done to create setting data.", 'Success!!', {"positionClass": "toast-bottom-right"});
    },
    err => {
      console.log(err);
      if (err._body != undefined && err._body != null) {
        self.toastrService.error(err._body, 'Error!!', {"positionClass": "toast-bottom-right"});
      } else {
        self.toastrService.error("Failed to create setting data.", 'Error!!', {"positionClass": "toast-bottom-right"});
      }
    });
  }

  update(){
    let self  = this;
    this.customerService.updateNASetting(this.settingData).then(
      res => {                
        self.toastrService.success("Successfully done to update setting data.", 'Success!!', {"positionClass": "toast-bottom-right"});
      },
      err => {
        console.log(err);
        if (err._body != undefined && err._body != null) {
          self.toastrService.error(err._body, 'Error!!', {"positionClass": "toast-bottom-right"});
        } else {
          self.toastrService.error("Failed to update setting data.", 'Error!!', {"positionClass": "toast-bottom-right"});
        }
      });
  }

  customTrackBy(index: number, obj: any): any {
    return index;
  }

}

