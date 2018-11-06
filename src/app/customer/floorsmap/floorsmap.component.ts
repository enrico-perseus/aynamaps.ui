import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { CustomerService } from "../../../components/auth/customer.service";
import { AuthService } from '../../../components/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from "@angular/router";

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-floorsmap',
  templateUrl: './floorsmap.component.html',
  styleUrls: ['../customer.item.css']
})
export class FloorsmapComponent implements OnInit {

  authService: AuthService;
  customerService: CustomerService;
  toastrService: ToastrService;
  router;
  viewRef: ViewContainerRef;
  buildings = [];
  floors = [];
  viewFloors = [];
  freeFloors = [];
  currentUser = {};
  selectedBuilding = '0';
  selectedFloor = [];
  facilities = [];
  destinations = [];
  pois = [];
  emergencies = [];
  beacons = [];
  users = [];
  locations = [{
    id: '',
    name: '',
    LocationType: '',
    status: '',
    floor_id: ''
  }];
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
      if (user.role = 'admin'){      
        self.currentUser = user;
        self.getBuildings();
        self.getFloors();        
      }
    });
  }

  getFloors(){
    let self = this;
    this.customerService.getFloors().then(
      res => {                
        self.floors = res.json();      
        console.log(this.floors);
        self.getViewFloors();
      },
      err => {        
      }
    )
  } 

  getViewFloors(){
    this.viewFloors = [];
    if (this.selectedBuilding != '' && this.selectedBuilding != '0'){
      for (let i = 0; i < this.floors.length; i++){
        if (this.floors[i].building_id == this.selectedBuilding){
          this.floors[i].selected = false;
          this.viewFloors.push(this.floors[i]);
        }
      }
    } else {
      for (let i = 0; i < this.floors.length; i++){        
          this.floors[i].selected = false;
          this.viewFloors.push(this.floors[i]);        
      }
    }
  }

  getBuildings(){
    let self = this;    
    this.customerService.getBuildings().then(
      res => {                
        self.buildings = res.json();
      },
      err => {        
        self.toastrService.error('Failed to get role list.', 'Error!!', {"positionClass": "toast-bottom-right"});
      }
    )
  }

  buildingChange(){
    console.log(this.selectedBuilding);
    this.selectedFloor = [];
    this.getViewFloors();    
  }   

  addFloors() {
    let self = this;
    let building_floors = 0;
    if (this.selectedBuilding == '' || this.selectedBuilding == '0') {
      this.toastrService.error('Please select Building', 'Error!!', {"positionClass": "toast-bottom-right"});
      return;
    }
    for (let i = 0; i < this.buildings.length; i++){
      if (this.buildings[i].building_id == this.selectedBuilding) {
        building_floors = this.buildings[i].no_of_floors; 
      }
    }
    for (let i = 0; i < building_floors; i++){
      let addable = true;
      for (let j = 0; j < this.viewFloors.length; j++){
        if (i == this.viewFloors[j].floor_position){
          addable = false;
        }
      }
      if (addable == true) this.freeFloors.push(i);
    }
    if (this.freeFloors.length == 0){
      this.toastrService.error('Can not add any floors in the building', 'Error!', {"positionClass": "toast-bottom-right"});
      return;
    }
    console.log(this.freeFloors);
    this.router.navigate(['customer/home', { outlets: { popup: ['addfloormaps', self.selectedBuilding, building_floors] } }]);
  }
  
  editFloors() {
    let self = this;
    if (this.selectedFloor.length == 1){
      let building_floors = 0;
      for (let i = 0; i < this.floors.length; i++){
        if (this.floors[i]._id == this.selectedFloor[0]._id) this.selectedBuilding = this.floors[i].building_id;
      }
      for (let i = 0; i < this.buildings.length; i++){
        if (this.buildings[i].building_id == this.selectedBuilding) {
          building_floors = this.buildings[i].no_of_floors; 
        }
      }
      
      this.router.navigate(['customer/home', { outlets: { popup: ['editfloormaps', self.selectedFloor[0]._id, building_floors] } }]);
    }
  }

  deleteFloors() {
    let self = this;
    if (this.selectedFloor.length == 1){
      let selectedFloor_id = '';
      for (let i = 0; i < this.floors.length; i++){
        if (this.floors[i]._id == this.selectedFloor[0]._id) selectedFloor_id = this.floors[i].short_name;
      }

      this.customerService.getLocationsbyFloor_id(selectedFloor_id).then(
        res => {                
          self.data = res.json();      
          console.log(self.data);
          if (self.data.length == 0){
            return self.customerService.removeFloor(self.selectedFloor[0]._id).then(
              res => {
                self.getFloors();
                self.selectedFloor = [];
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
          } else {
            self.total = 0;
            for (let i = 0; i < self.data.length ; i++){
              self.total = self.total + self.data[i].number;
            }
            $("#searchPage").show();
            $("#MainPage").hide();
          }
        },
        err => {
          self.toastrService.error('Failed to get positions by floorID list.', 'Error!!', {"positionClass": "toast-bottom-right"});        
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

  selectFloor(floor) {
    floor.selected  = !floor.selected;
    if (floor.selected) {
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
    $('#categoryTable').tableExport({type:'pdf',escape:'false', tableName:'floormaps'});
  }

  exportToExcel() {
    $('#categoryTable').tableExport({type:'excel',escape:'false', tableName:'floormaps'});
  }
}
