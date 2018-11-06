import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { FacilitiesComponent } from '../../locations/facilities/facilities.component';
import { CustomerService } from "../../../../components/auth/customer.service";
import { AuthService } from '../../../../components/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import {Router} from "@angular/router";

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['../../customer.item.css']
})
export class RolesComponent implements OnInit {

  authService: AuthService;
  customerService: CustomerService;
  toastrService: ToastrService;
  router;
  viewRef: ViewContainerRef;
  roles = [];
  currentUser = {};
  usersInfo = [];

  selectedRole = [];
  data = [];
  total = 0;
  p = 1;

  filter;
  key;
  reverse;

  constructor(private _authService: AuthService,
              private _toastrSevice: ToastrService,
              private _router: Router,
              private _viewRef: ViewContainerRef,
              private _customerService: CustomerService) {
    this.authService = _authService; 
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
      self.getRoles();
    });
  }

  getUsers(){
    let self = this;
    this.customerService.getUsers().then(
      res => {
        self.usersInfo = res.json();
        for (let i = 0; i < self.roles.length; i++){
          self.roles[i].usage = 0;
          for (let j = 0; j < self.usersInfo.length; j++){
            if (self.roles[i].role_name == self.usersInfo[j].role) self.roles[i].usage++;
          }
        }
      },
      err => {

      }
    )
  }
  
  getRoles(){
    let self = this;
    this.customerService.getRoles().then(
      res => {                
        self.roles = res.json();
        self.getUsers();      
        console.log(this.roles)
      },
      err => {        
        self.toastrService.error('Failed to get role list.', 'Error!!', {"positionClass": "toast-bottom-right"});
      }
    )
  }

  editRole() {
    if (this.selectedRole.length == 1)  
      this.router.navigate(['customer/home', { outlets: { popup: ['editroles', this.selectedRole[0]._id] } }]);
  }

  deleteRole() {
    let self = this;
    if (this.selectedRole.length == 1){
      let selectedRole_name = '';
      for (let i = 0; i < this.roles.length; i ++){
        if (this.roles[i]._id == this.selectedRole[0]._id) selectedRole_name = this.roles[i].role_name;
      }
      console.log(selectedRole_name);
      this.customerService.getUsingbyRoleName(selectedRole_name).then(
        res => {                
          self.data = res.json();
          console.log("getUsingbyRoleName result ========= " + self.data);
          if (self.data.length == 0){
            return this.customerService.removeRole(this.selectedRole[0]._id).then(
              res => {
                self.getRoles();
                self.selectedRole = [];
              },
              err => {
                console.log(err);
                if (err._body != undefined && err._body != null) {
                  self.toastrService.error(err._body, 'Error!!', {"positionClass": "toast-bottom-right"});
                } else {
                  self.toastrService.error("Failed to remove role.", 'Error!!', {"positionClass": "toast-bottom-right"});
                }
              }
            )
          } else {
            self.total = 0;
            for (let i = 0; i < self.data.length ; i++){
              self.total = self.total + self.data[i].position.length;
            }
            $("#searchPage").show();
            $("#MainPage").hide();
          }          
      },
      err => {        
          self.toastrService.error('Failed to get using list.', 'Error!!', {"positionClass": "toast-bottom-right"});
      }
    )
  }
}

  searchPageHide(){
    $("#MainPage").show();
    $("#searchPage").hide();
  }

  routeItem(itemName: String){
    this.router.navigate(['customer/home', { outlets: { popup: [itemName] } }]);
  }  

  

  selectRole(role) {
    role.selected = !role.selected;
    if (role.selected) {
      this.selectedRole.push({_id: role._id});
    } else {
      this.selectedRole = this.selectedRole.filter(item => item._id != role._id);
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
    $('#categoryTable').tableExport({type:'pdf',escape:'false', tableName:'roles'});
  }

  exportToExcel() {
    $('#categoryTable').tableExport({type:'excel',escape:'false', tableName:'roles'});
  }
}
