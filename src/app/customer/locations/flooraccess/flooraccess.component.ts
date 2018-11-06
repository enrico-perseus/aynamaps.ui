import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { CustomerService } from "../../../../components/auth/customer.service";
import { AuthService } from '../../../../components/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import {Router} from "@angular/router";

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-flooraccess',
  templateUrl: './flooraccess.component.html',
  styleUrls: ['./flooraccess.component.css']
})
export class FlooraccessComponent implements OnInit {

  authService: AuthService;
  customerService: CustomerService;
  toastrService: ToastrService;
  router;
  viewRef: ViewContainerRef;
  buildings = [];
  floors = [];
  viewFloors = [];
  currentUser = {};
  selectedBuilding = '0';
  selectedFloor = [];
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
      self.getBuildings();
      self.getFloors();
    });
  }

  getBuildings(){
    let self = this;
    this.customerService.getBuildings().then(
      res => {                
        self.buildings = res.json();
        //self.selectedBuilding = self.buildings[0].building_id;      
        console.log(self.selectedBuilding);
      },
      err => {        
        self.toastrService.error('Failed to get role list.', 'Error!!', {"positionClass": "toast-bottom-right"});
      }
    )
  }

  buildingChange(){
    console.log(this.selectedBuilding);
    this.getViewFloors();    
  }

  addFloors() {
    let self = this;
    if (this.selectedBuilding == '' || this.selectedBuilding == '0') {
      this.toastrService.error('Please select Building', 'Error!!', {"positionClass": "toast-bottom-right"});
      return;
    }
    this.router.navigate(['customer/home', { outlets: { popup: ['addflooraccess', self.selectedBuilding] } }]);
  }

  editFloors() {
    let self = this;
    if (this.selectedFloor.length == 1)
    this.router.navigate(['customer/home', { outlets: { popup: ['editflooraccess', self.selectedFloor[0]._id] } }]);
  }

  deleteFloors() {
    let self = this;
    if (this.selectedFloor.length == 1) {
      return this.customerService.removeFloorAccess(this.selectedFloor[0]._id).then(
        res => {
          self.getFloors();
        },
        err => {
          console.log(err);
          if (err._body != undefined && err._body != null) {
            self.toastrService.error(err._body, 'Error!!', {"positionClass": "toast-bottom-right"});
          } else {
            self.toastrService.error("Failed to remove floor.", 'Error!!', {"positionClass": "toast-bottom-right"});
          }
        }
      )
    }
  }

  getFloors(){
    let self = this;
    this.customerService.getFloorAccesses().then(
      res => {                
        self.floors = res.json();
        self.getViewFloors();      
        console.log(this.floors);
      },
      err => {        
        self.toastrService.error('Failed to get floors list.', 'Error!!', {"positionClass": "toast-bottom-right"});
      }
    )
  }

  getViewFloors(){
    if (this.selectedBuilding == '0' || this.selectedBuilding == ''){
      this.viewFloors = this.floors;
    } else {
      this.viewFloors = [];
      for (let i = 0; i < this.floors.length; i++){
        if (this.floors[i].building_id == this.selectedBuilding){
          this.viewFloors.push(this.floors[i]);
        }
      }
    }
    this.selectedFloor = [];
  }

  selectFloor(floor) {
    floor.selected  = !floor.selected;
    if (floor.selected){
      this.selectedFloor.push({_id: floor._id});
    } else {
      this.selectedFloor = this.selectedFloor.filter(item => item._id != floor._id);
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
    $('#categoryTable').tableExport({type:'pdf',escape:'false', tableName:'flooraccess'});
  }

  exportToExcel() {
    $('#categoryTable').tableExport({type:'excel',escape:'false', tableName:'flooraccess'});
  }
}

