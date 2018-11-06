import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { CustomerService } from "../../../../components/auth/customer.service";
import { AuthService } from '../../../../components/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from "@angular/router";

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-buildings',
  templateUrl: './buildings.component.html',
  styleUrls: ['../../customer.item.css']
})
export class BuildingsComponent implements OnInit {

  authService: AuthService;
  customerService: CustomerService;
  toastrService: ToastrService;
  router;
  viewRef: ViewContainerRef;
  buildings = [];
  currentUser = {};

  selectedBuilding = [];
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
      if (user.role == 'admin') {
        self.currentUser = user;
        self.getBuildings();
      }
    });
  }

  getBuildings(){
    let self = this;
    this.customerService.getBuildings().then(
      res => {                
        self.buildings = res.json();      
        console.log(this.buildings)
      },
      err => {        
        self.toastrService.error('Failed to get role list.', 'Error!!', {"positionClass": "toast-bottom-right"});
      }
    )
  }
  
  addBuilding() {
    let self = this;
    if (this.currentUser['is_building_unlimited'] == false && this.currentUser['building_value'] == this.buildings.length) {
      this.toastrService.error('Can not add the building', 'Error!!', {"positionClass": "toast-bottom-right"});
      return;
    }
    this.router.navigate(['customer/home', { outlets: { popup: ['editbuildings', ''] } }]);
  }
  

  editBuilding() {
    let self = this;
    if (this.selectedBuilding.length == 1)
    this.router.navigate(['customer/home', { outlets: { popup: ['editbuildings', self.selectedBuilding[0]._id] } }]);
  }

  deleteBuilding() {
    let self = this;
    if (this.selectedBuilding.length == 1){
      let selectedBuilding_id = '';
      for (let i = 0; i < this.buildings.length; i ++){
        if (this.buildings[i]._id == this.selectedBuilding[0]._id) selectedBuilding_id = this.buildings[i].building_id;
      }
      this.customerService.getFloorsbyBuildingId(selectedBuilding_id).then(
        res => {                
          self.data = res.json();
          console.log(self.data);
          if (self.data.length == 0){
            return self.customerService.removeBuilding(self.selectedBuilding[0]._id).then(
              res => {
                self.getBuildings();
                self.selectedBuilding = [];
              },
              err => {
                console.log(err);
                if (err._body != undefined && err._body != null) {
                  self.toastrService.error(err._body, 'Error!!', {"positionClass": "toast-bottom-right"});
                } else {
                  self.toastrService.error("Failed to remove building.", 'Error!!', {"positionClass": "toast-bottom-right"});
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
          self.toastrService.error('Failed to get floor by buildingID list.', 'Error!!', {"positionClass": "toast-bottom-right"});
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

  selectBuilding(building) {
    
    building.selected = !building.selected;
    if (building.selected){
      this.selectedBuilding.push({_id: building._id});
    } else {
      this.selectedBuilding = this.selectedBuilding.filter(item => item._id != building._id);
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
    $('#categoryTable').tableExport({type:'pdf',escape:'false', tableName:'buildigns'});
  }

  exportToExcel() {
    $('#categoryTable').tableExport({type:'excel',escape:'false', tableName:'buildings'});
  }
}
