
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { CustomerService } from "../../../../components/auth/customer.service";
import { AuthService } from '../../../../components/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from "@angular/router";

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-emergencies',
  templateUrl: './emergencies.component.html',
  styleUrls: ['../../customer.item.css']
})
export class EmergenciesComponent implements OnInit {

  authService: AuthService;
  customerService: CustomerService;
  toastrService: ToastrService;
  router;
  viewRef: ViewContainerRef;
  buildings = [];
  floors = [];
  emergencies = [];
  viewEmergencies = [];
  currentUser = {};
  selectedBuilding = '0';
  selectedFloor = '0';
  selectedEmergency = [];
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
      self.getEmergencies();      
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
    this.getViewEmergencies();    
  }

  floorChange(){
    console.log(this.selectedFloor);
    this.getViewEmergencies();    
  }

  addEmergency() {
    let self = this;
    if (this.selectedBuilding == '' || this.selectedBuilding == '0') {
      this.toastrService.error('Please select Building', 'Error!!', {"positionClass": "toast-bottom-right"});
      return;
    }
    if (this.selectedFloor == '' || this.selectedFloor == '0') {
      this.toastrService.error('Please select Floor', 'Error!!', {"positionClass": "toast-bottom-right"});
      return;
    }
    this.router.navigate(['customer/home', { outlets: { popup: ['addemergencies', self.selectedBuilding, self.selectedFloor] } }]);
  }

  
  editEmergency() {
    let self = this;
    if (this.selectedEmergency.length == 1)
    this.router.navigate(['customer/home', { outlets: { popup: ['editemergencies', self.selectedEmergency[0]._id] } }]);
  }

  deleteEmergency() {
    let self = this;
    if (this.selectedEmergency.length == 1) {
      return this.customerService.removeEmergency(this.selectedEmergency[0]._id).then(
        res => {
          self.getEmergencies();
        },
        err => {
          console.log(err);
          if (err._body != undefined && err._body != null) {
            self.toastrService.error(err._body, 'Error!!', {"positionClass": "toast-bottom-right"});
          } else {
            self.toastrService.error("Failed to remove Facility.", 'Error!!', {"positionClass": "toast-bottom-right"});
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

  getEmergencies(){
    let self = this;
    this.customerService.getEmergencies().then(
      res => {                
        self.emergencies = res.json();
        self.getViewEmergencies();      
        console.log(this.emergencies)
      },
      err => {        
        self.toastrService.error('Failed to get emergencies list.', 'Error!!', {"positionClass": "toast-bottom-right"});
      }
    )
  }

  getViewEmergencies(){
    if (this.selectedFloor != '' && this.selectedFloor != '0'){
      this.viewEmergencies = [];
      for (let i = 0; i < this.emergencies.length; i++){
        if (this.emergencies[i].floor_id == this.selectedFloor){
          this.viewEmergencies.push(this.emergencies[i]);
        }
      }
    } else if (this.selectedBuilding != '' && this.selectedBuilding != '0'){
      this.viewEmergencies = [];
      for (let i = 0; i < this.emergencies.length; i++){
        if (this.emergencies[i].building_id == this.selectedBuilding){
          this.viewEmergencies.push(this.emergencies[i]);
        }
      }
    } else {
      this.viewEmergencies = this.emergencies;
    }
    this.selectedEmergency = [];
  }

  selectFloor(id) {
    this.selectedFloor = id;
    console.log(this.selectedFloor); 
  }

  selectEmergency(emergency) {
    emergency.selected  = !emergency.selected;
    if (emergency.selected) {
      this.selectedEmergency.push({_id: emergency._id});
    } else {
      this.selectedEmergency = this.selectedEmergency.filter(item => item._id != emergency._id);
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
    $('#categoryTable').tableExport({type:'pdf',escape:'false', tableName:'Emergencies'});
  }

  exportToExcel() {
    $('#categoryTable').tableExport({type:'excel',escape:'false', tableName:'Emergencies'});
  }
}


