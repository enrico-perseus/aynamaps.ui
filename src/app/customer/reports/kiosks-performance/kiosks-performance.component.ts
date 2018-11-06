import { Component, OnInit } from '@angular/core';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { CustomerService } from "../../../../components/auth/customer.service";
import { AuthService } from '../../../../components/auth/auth.service';
import { LocationService } from '../../../../components/auth/location.service';
import { ToastrService } from 'ngx-toastr';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-kiosks-performance',
  templateUrl: './kiosks-performance.component.html',
  styleUrls: ['./kiosks-performance.component.css']
})
export class KiosksPerformanceComponent implements OnInit {

  
  authService: AuthService;
  customerService: CustomerService;
  toastrService: ToastrService;
  locationService : LocationService;
  singleSelectOption = {
    width: '100%'
  };
  multiSelectOption = {
    width: '100%',
    multiple: true,
    theme: 'classic',
    closeOnSelect: false
  };
  languages = [];
  myOptions: IMultiSelectOption[];

  mySettings: IMultiSelectSettings = {
    //enableSearch: true,
    checkedStyle: 'fontawesome',
    //buttonClasses: 'btn btn-default btn-block',
    dynamicTitleMaxItems: 3,
    displayAllSelectedText: true
  };

  // Text configuration
  myTexts: IMultiSelectTexts = {
    checkAll: 'Select all',
    uncheckAll: 'Unselect all',
    checked: 'item selected',
    checkedPlural: 'items selected',
    searchPlaceholder: 'Find',
    searchEmptyResult: 'Nothing found...',
    searchNoRenderText: 'Type in search box to see results...',
    defaultTitle: 'All selected',
    allSelected: 'All selected',
  };

  searchNmData = {
    from: '',
    to: '',
    group: '',
    building: '',
    floor: ''
  };
  viewNms = [];

  buildings = [];
  floors = [];
  groups = [];
  currentUser = {};
  selectedBuilding = '';
  selectedFloor = '';
  selectedGroup = '';
  selectedFrom = '';
  selectedTo = '';
  viewBuildings  = [];
  viewFloors = [];
  viewSegments = [];
  viewGroups = [];

  key;
  reverse;
  filter;

  constructor(private _authService: AuthService,
              private _customerService: CustomerService,
              private _locationService: LocationService,
              private _toastrService: ToastrService) {
    this.authService = _authService;
    this.locationService = _locationService;
    this.customerService = _customerService;
    this.toastrService =  _toastrService;
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
      if (user.role == 'admin'){
        self.currentUser = user;
        self.getBuildings();
        self.getFloors();
        self.getGroups();
      }
    });
  }

  getBuildings(){
    let self = this;
    this.customerService.getBuildings().then(
      res => {                
        self.buildings = res.json();
        self.viewBuildings = [];
        for (let i = 0; i < self.buildings.length; i++){
          self.viewBuildings.push({id: self.buildings[i].building_id, name: self.buildings[i].building_name[0].name});
        }      
        console.log(self.viewBuildings);
      },
      err => {        
        self.toastrService.error('Failed to get buildings list.', 'Error!!', {"positionClass": "toast-bottom-right"});
      }
    )
  }

  getFloors(){
    let self = this;
    let selectedBuilding = this.selectedBuilding;
    if (selectedBuilding == '0' || selectedBuilding == '') {
      this.customerService.getFloors().then(
        res => {                
          self.floors = res.json();
          self.viewFloors = [];
          for (let i = 0; i < self.floors.length; i++){
            self.viewFloors.push({id: self.floors[i].short_name, name: self.floors[i].long_name[0].name});
          }      
          console.log(self.viewFloors);
        },
        err => {        
          self.toastrService.error('Failed to get floors list.', 'Error!!', {"positionClass": "toast-bottom-right"});
        }
      )
    } else {
      this.customerService.getFloorOrdersbyBuildingId(selectedBuilding).then(
        res => {                
          self.viewFloors = [];
          for (let i = 0; i < self.floors.length; i++){
            self.viewFloors.push({id: self.floors[i].short_name, name: self.floors[i].long_name[0].name});
          }      
          console.log(self.viewFloors);
        },
        err => {        
          self.toastrService.error('Failed to get floors list.', 'Error!!', {"positionClass": "toast-bottom-right"});
        }
      )
    }
  }

  getGroups(){
    let self = this;
    this.locationService.getGroup().toPromise()
    .then(
      res => {                
        self.groups = res;
        self.viewGroups = [];
        for (let i = 0; i < self.groups.length; i++){
           self.viewGroups.push({id: self.groups[i].group_name, name: self.groups[i].group_name}); 
        }
        console.log(self.viewGroups);
      },
      err => {        
        self.toastrService.error('Failed to get groups list.', 'Error!!', {"positionClass": "toast-bottom-right"});
      }
    )
  }

  buildingChange(){
    console.log(this.selectedBuilding);
    this.getFloors();    
    this.selectedFloor = '';
  }

  floorChange(){
    console.log(this.selectedFloor);
  }


  exportToPDF() {

  }

  exportToExcel() {

  }
  
  openMenu() {
    var x = document.getElementById("langNav");    
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
  }

}
