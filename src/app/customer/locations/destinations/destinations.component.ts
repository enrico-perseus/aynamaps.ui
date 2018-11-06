import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { CustomerService } from "../../../../components/auth/customer.service";
import { AuthService } from '../../../../components/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from "@angular/router";

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-destinations',
  templateUrl: './destinations.component.html',
  styleUrls: ['../../customer.item.css']
})
export class DestinationsComponent implements OnInit {

  authService: AuthService;
  customerService: CustomerService;
  toastrService: ToastrService;
  router;
  viewRef: ViewContainerRef;
  buildings = [];
  floors = [];
  destinations = [];
  viewDestinations = [];
  currentUser = {};
  selectedBuilding = '0';
  selectedFloor = '0';
  selectedDestination = [];
  p = 1;
  filter;
  reverse;
  key;

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
      self.getDestinations();
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
        self.toastrService.error('Failed to get facility list.', 'Error!!', {"positionClass": "toast-bottom-right"});
      }
    )
  }

  buildingChange(){
    console.log(this.selectedBuilding);
    this.getFloors();
    this.selectedFloor = '';
    this.getViewDestinations();

  }

  floorChange(){
    console.log(this.selectedFloor);
    this.getViewDestinations();    
  }
  
  addDestination() {
    let self = this;
    if (this.currentUser['is_destination_unlimited'] == false && this.currentUser['destination_value'] == this.destinations.length) {
      this.toastrService.error('Can not add the destination', 'Error!!', {"positionClass": "toast-bottom-right"});
      return;
    }
    if (this.selectedBuilding == '' || this.selectedBuilding == '0') {
      this.toastrService.error('Please select Building', 'Error!!', {"positionClass": "toast-bottom-right"});
      return;
    }
    if (this.selectedFloor == '' || this.selectedFloor == '0') {
      this.toastrService.error('Please select Floor', 'Error!!', {"positionClass": "toast-bottom-right"});
      return;
    }
    this.router.navigate(['customer/home', { outlets: { popup: ['adddestinations', self.selectedBuilding, self.selectedFloor] } }]);
  } 

  editDestination() {
    if (this.selectedDestination.length == 1)
    this.router.navigate(['customer/home', { outlets: { popup: ['editdestinations', this.selectedDestination[0]._id] } }]);
  }

  deleteDestination() {
    let self = this;
    if (this.selectedDestination.length == 1){
      return this.customerService.removeDestination(this.selectedDestination[0]._id).then(
        res => {
          self.getDestinations();
        },
        err => {
          console.log(err);
          if (err._body != undefined && err._body != null) {
            self.toastrService.error(err._body, 'Error!!', {"positionClass": "toast-bottom-right"});
          } else {
            self.toastrService.error("Failed to remove Destination.", 'Error!!', {"positionClass": "toast-bottom-right"});
          }
        }
      )
    }
  }

  getFloors(){
    let self = this;
    let selectedBuilding = this.selectedBuilding;
    if (selectedBuilding == '0' || selectedBuilding == '') {
      this.customerService.getFloors().then(
        res => {                
          self.floors = res.json();

          console.log(this.floors)
        },
        err => {        
          self.toastrService.error('Failed to get floors list.', 'Error!!', {"positionClass": "toast-bottom-right"});
        }
      )
    } else {
      this.customerService.getFloorOrdersbyBuildingId(selectedBuilding).then(
        res => {                
          self.floors = res.json();      
          console.log(this.floors)
        },
        err => {        
          self.toastrService.error('Failed to get floors list.', 'Error!!', {"positionClass": "toast-bottom-right"});
        }
      )
    }
  }

  getDestinations(){
    let self = this;
    this.customerService.getDestinations().then(
      res => {                
        self.destinations = res.json();
        self.getViewDestinations();      
        console.log(this.destinations)
      },
      err => {        
        self.toastrService.error('Failed to get destinations list.', 'Error!!', {"positionClass": "toast-bottom-right"});
      }
    )
  }

  getViewDestinations(){
    if (this.selectedFloor != '' && this.selectedFloor != '0'){
      this.viewDestinations = [];
      for (let i = 0; i < this.destinations.length; i++){
        if (this.destinations[i].floor_id == this.selectedFloor){
          this.viewDestinations.push(this.destinations[i]);
        }
      }
    } else if (this.selectedBuilding != '' && this.selectedBuilding != '0'){
      this.viewDestinations = [];
      for (let i = 0; i < this.destinations.length; i++){
        if (this.destinations[i].building_id == this.selectedBuilding){
          this.viewDestinations.push(this.destinations[i]);
        }
      }
    } else {
      this.viewDestinations = this.destinations;
    }
    this.selectedDestination = [];
  }

  selectFloor(id) {
    this.selectedFloor = id;
    console.log(this.selectedFloor); 
  }

  selectDestination(destination) {
    destination.selected  = !destination.selected;
    if (destination.selected) {
      this.selectedDestination.push({_id: destination._id});
    } else {
      this.selectedDestination = this.selectedDestination.filter(item => item._id != destination._id);
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
    $('#categoryTable').tableExport({type:'pdf',escape:'false', tableName:'Destinations'});
  }

  exportToExcel() {
    $('#categoryTable').tableExport({type:'excel',escape:'false', tableName:'Destinations'});
  }
}

