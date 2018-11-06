import { NgModule, Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { LocationService } from '../../../../../components/auth/location.service';
import { CustomerService } from "../../../../../components/auth/customer.service";
import { AuthService } from '../../../../../components/auth/auth.service';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-new-roles',
  templateUrl: './new-roles.component.html',
  styleUrls: ['./new-roles.component.css']
})

export class NewRolesComponent implements OnInit {


  toastrService: any;
  locationService: any;
  customerService: any;
  authService: any;
  Router: any;
  currentUser: {};

  role = {
      customer_id: '',
      name: '',
      cm_v: false,
      cm_m: false,
      cm_d: false,
      nm_v: false,
      nm_m: false,
      nm_d: false,
      rp_v: false, 
      sm_v: false,
      sm_m: false,
      sm_d: false,
      status: true      
  };

  roleData = {
    customer_id: '',
    role_name: '',
    status: true,
    content_management: '0,1,1',
    network_management: '0,1,1',
    reports: '1',
    system_management: '0,1,1'          
  };
  
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
    });
  }

  is_cm_v(){    
    this.role.cm_v = !this.role.cm_v;
    if (this.role.cm_v) this.role.cm_m = false;
    
  }

  is_cm_m(){    
    this.role.cm_m = !this.role.cm_m;
    if(this.role.cm_m) this.role.cm_v = false;
  }

  is_nm_v(){    
    this.role.nm_v = !this.role.nm_v;
    if(this.role.nm_v) this.role.nm_m = false;
  }

  is_nm_m(){    
    this.role.nm_m = !this.role.nm_m;
    if(this.role.nm_m) this.role.nm_v = false;
  }

  is_sm_v(){    
    this.role.sm_v = !this.role.sm_v;
    if (this.role.sm_v) this.role.sm_m = false;
  }

  is_sm_m(){    
    this.role.sm_m = !this.role.sm_m;
    if (this.role.sm_m) this.role.sm_v = false;
  }

  save() {
    let self = this;
    this.roleData.customer_id = this.currentUser['_id'];
    this.roleData.role_name = this.role.name;
    this.roleData.status = this.role.status;
    (this.role.cm_v)? this.roleData.content_management = '1': this.roleData.content_management = '0';
    (this.role.cm_m)? this.roleData.content_management = this.roleData.content_management + ',1': this.roleData.content_management = this.roleData.content_management + ',0';
    (this.role.cm_d)? this.roleData.content_management = this.roleData.content_management + ',1': this.roleData.content_management = this.roleData.content_management + ',0';
    (this.role.nm_v)? this.roleData.network_management = '1': this.roleData.network_management = '0';
    (this.role.nm_m)? this.roleData.network_management = this.roleData.network_management + ',1': this.roleData.network_management = this.roleData.network_management + ',0';
    (this.role.nm_d)? this.roleData.network_management = this.roleData.network_management + ',1': this.roleData.network_management = this.roleData.network_management + ',0';
    (this.role.rp_v)? this.roleData.reports = '1': this.roleData.reports = '0';
    (this.role.sm_v)? this.roleData.system_management = '1': this.roleData.system_management = '0';
    (this.role.sm_m)? this.roleData.system_management = this.roleData.system_management + ',1': this.roleData.system_management = this.roleData.system_management + ',0';
    (this.role.sm_d)? this.roleData.system_management = this.roleData.system_management + ',1': this.roleData.system_management = this.roleData.system_management + ',0';
    if (this.roleData.content_management == '0,0,0' && this.roleData.network_management == '0,0,0' && this.roleData.reports == '0' && this.roleData.system_management == '0,0,0'){
      self.toastrService.error("Please Select Atleast one permission", 'Error!!', {"positionClass": "toast-bottom-right"});
      return;
    } 
    console.log(this.roleData);
    this.customerService.createRole(this.roleData).then(
      res => {                
        self.Router.navigate(['/customer/home', { outlets: { popup: ['roles'] } }]);
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
  
  GetRoleList(){
    this.Router.navigate(['/customer/home', { outlets: { popup: ['roles'] } }]);
  }
}
    