import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ModalDialogService } from 'ngx-modal-dialog';
import { FacilitiesComponent } from '../../locations/facilities/facilities.component';
import { CustomerService } from "../../../../components/auth/customer.service";
import { AuthService } from '../../../../components/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from "@angular/router";
import {environment} from '../../../../environments/environment';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-users_info',
  templateUrl: './users.component.html',
  styleUrls: ['../../customer.item.css']
})
export class UsersComponent implements OnInit {

  modalService: ModalDialogService;
  authService: AuthService;
  customerService: CustomerService;
  toastrService: ToastrService;
  router;
  viewRef: ViewContainerRef;
  users = [];
  currentUser = {};

  selectedUser = [];
  p = 1;
  basePath = environment.basePath;

  filter;
  key;
  reverse;

  constructor(private _authService: AuthService,
              private _modalService: ModalDialogService,
              private _toastrSevice: ToastrService,
              private _router: Router,
              private _viewRef: ViewContainerRef,
              private _customerService: CustomerService) {
    this.authService = _authService; 
    this.modalService = _modalService;
    this.customerService = _customerService;
    this.toastrService = _toastrSevice;
    this.router = _router;
    this.viewRef = _viewRef;
  }

  ngOnInit() {
    this.reset();
    let self = this;
    this.authService.currentUserChanged.subscribe(user => {
      self.currentUser = user;
      self.reset();
  });
    $(document).ready(function() {
      var $searchTrigger = $('[data-ic-class="search-trigger"]'),
      $searchInput = $('[data-ic-class="search-input"]'),
      $searchClear = $('[data-ic-class="search-clear"]');
      $searchTrigger.click(function () {
          var $this = $('[data-ic-class="search-trigger"]');
          $this.addClass('active');
          $searchInput.focus();
      });
      
      $searchInput.blur(function () {
          if ($searchInput.val().length > 0) {
              return false;
          } else {
              $searchTrigger.removeClass('active');
          }
      });
    });
  }

  reset() {
    let self = this;
    this.authService.getCurrentUser().then(user => {      
      self.currentUser = user;
      self.getUsers();
    });    
  }

  getUsers(){
    let self = this;
    let admin = {
      name: this.currentUser['user_type'],
      role: this.currentUser['role'],
      email: this.currentUser['email'],
      logo: this.currentUser['avatar'],
      createdAt: this.currentUser['subscription_start_date'],
      status: true,
      type: 'Admin'
    }
    this.users = [];    
    
    this.customerService.getUsers().then(
      res => {
        let result = res.json();
        self.users = [];
        self.users.push(admin);
        for (let i = 0; i < result.length; i++){
          self.users.push(result[i]);
        }      
        
      },
      err => {        
        self.toastrService.error('Failed to get user list.', 'Error!!', {"positionClass": "toast-bottom-right"});
      }
    )
  }

  addUser() {
    let self = this;
    if (this.currentUser['is_user_unlimited'] == false && this.currentUser['user_value'] == this.users.length) {
      this.toastrService.error('Can not add the user', 'Error!!', {"positionClass": "toast-bottom-right"});
      return;
    }
    this.router.navigate(['customer/home', { outlets: { popup: ['newusers'] } }]);
  }

  editUser() {
    if (this.selectedUser.length == 1)
      this.router.navigate(['customer/home', { outlets: { popup: ['editusers', this.selectedUser[0]._id] } }]);
  }

  deleteUser() {
    let self = this;
    if (this.selectedUser.length == 1){
      return this.customerService.removeUser(this.selectedUser[0]._id).then(
        res => {
          self.getUsers();
          self.selectedUser = [];
        },
        err => {
          console.log(err);
          if (err._body != undefined && err._body != null) {
            self.toastrService.error(err._body, 'Error!!', {"positionClass": "toast-bottom-right"});
          } else {
            self.toastrService.error("Failed to remove timesolt.", 'Error!!', {"positionClass": "toast-bottom-right"});
          }
        }
      )
    }
  }  

  selectUser(user) {

    if (user._id) {
      user.selected = !user.selected;
      if (user.selected) {
        this.selectedUser.push({_id: user._id});
      } else {
        this.selectedUser = this.selectedUser.filter(item => item._id != user._id);
      }
    }
  }

  openMenu() {
    var x = document.getElementById("langNav");    
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
  }

  exportToPDF() {
    $('#categoryTable').tableExport({type:'pdf',escape:'false', tableName:'users_info'});
  }

  exportToExcel() {
    $('#categoryTable').tableExport({type:'excel',escape:'false', tableName:'users_info'});
  }

}
