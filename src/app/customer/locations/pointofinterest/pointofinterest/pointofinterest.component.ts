import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { CustomerService } from "../../../../../components/auth/customer.service";
import { AuthService } from '../../../../../components/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from "@angular/router";

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-pointofinterest',
  templateUrl: './pointofinterest.component.html',
  styleUrls: ['../../../customer.item.css']
})
export class PointofinterestComponent implements OnInit {

  authService: AuthService;
  customerService: CustomerService;
  toastrService: ToastrService;
  router;
  viewRef: ViewContainerRef;
  buildings = [];
  floors = [];
  pois = [];
  viewpois = [];
  currentUser = {};
  selectedBuilding = '0';
  selectedFloor = '0';
  selectedPoi = [];
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
      self.getPois();
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
        self.toastrService.error('Failed to get building list.', 'Error!!', {"positionClass": "toast-bottom-right"});
      }
    )
  }

  buildingChange(){
    console.log(this.selectedBuilding);
    this.getFloors();    
    this.selectedFloor = '';
    this.getViewPois();
  }

  floorChange(){
    console.log(this.selectedFloor);
    this.getViewPois();    
  }

  addPois() {
    let self = this;
    if (this.selectedBuilding == '' || this.selectedBuilding == '0') {
      this.toastrService.error('Please select Building', 'Error!!', {"positionClass": "toast-bottom-right"});
      return;
    }
    if (this.selectedFloor == '' || this.selectedFloor == '0') {
      this.toastrService.error('Please select Floor', 'Error!!', {"positionClass": "toast-bottom-right"});
      return;
    }
    this.router.navigate(['customer/home', { outlets: { popup: ['addpoi', self.selectedBuilding, self.selectedFloor] } }]);
  }

 

  editPois() {
    if (this.selectedPoi.length == 1)
    this.router.navigate(['customer/home', { outlets: { popup: ['editpoi', this.selectedPoi[0]._id] } }]);
  }

  deletePois() {
    let self = this;
    if (this.selectedPoi.length == 1) {
      return this.customerService.removePoi(this.selectedPoi[0]._id).then(
        res => {
          self.getPois();
        },
        err => {
          console.log(err);
          if (err._body != undefined && err._body != null) {
            self.toastrService.error(err._body, 'Error!!', {"positionClass": "toast-bottom-right"});
          } else {
            self.toastrService.error("Failed to remove POI.", 'Error!!', {"positionClass": "toast-bottom-right"});
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

  getPois(){
    let self = this;
    this.customerService.getPois().then(
      res => {                
        self.pois = res.json();
        self.getViewPois();     
        console.log(this.pois)
      },
      err => {        
        self.toastrService.error('Failed to get floors list.', 'Error!!', {"positionClass": "toast-bottom-right"});
      }
    )
  }

  getViewPois(){
    if (this.selectedFloor != '' && this.selectedFloor != '0'){
      this.viewpois = [];
      for (let i = 0; i < this.pois.length; i++){
        if (this.pois[i].floor_id == this.selectedFloor){
          this.viewpois.push(this.pois[i]);
        }
      }
    } else if (this.selectedBuilding != '' && this.selectedBuilding != '0'){
      this.viewpois = [];
      for (let i = 0; i < this.pois.length; i++){
        if (this.pois[i].building_id == this.selectedBuilding){
          this.viewpois.push(this.pois[i]);
        }
      }
    } else {
      this.viewpois = this.pois;
    }
    this.selectedPoi = [];
  }

  selectFloor(id) {
    this.selectedFloor = id;    
    console.log(this.selectedFloor); 
  }

  selectPoi(poi) {    
    poi.selected  = !poi.selected;
    if (poi.selected) {
      this.selectedPoi.push({_id: poi._id});
    } else {
      this.selectedPoi = this.selectedPoi.filter(item => item._id != poi._id);
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
    $('#categoryTable').tableExport({type:'pdf',escape:'false', tableName:'PointofInterest'});
  }

  exportToExcel() {
    $('#categoryTable').tableExport({type:'excel',escape:'false', tableName:'PointofInterest'});
  }
}

