import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { LocationService } from '../../../../components/auth/location.service';
import { CustomerService } from "../../../../components/auth/customer.service";
import { AuthService } from '../../../../components/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import {Router} from "@angular/router";

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css']
})
export class PlayersComponent implements OnInit {

  locationService: LocationService;
  authService: AuthService;
  customerService: CustomerService;
  toastrService: ToastrService;
  router;
  viewRef: ViewContainerRef;
  buildings = [];
  floors = [];
  players = [];
  viewPlayers = [];
  currentUser = {};
  selectedBuilding = '0';
  selectedFloor = '0';
  selectedPlayer = [];
  p = 1;
  filter;
  key;
  reverse;

  constructor(private _locationService: LocationService,
              private _authService: AuthService,
              private _toastrSevice: ToastrService,
              private _router: Router,
              private _viewRef: ViewContainerRef,
              private _customerService: CustomerService) {
    this.locationService = _locationService;
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
      self.getPlayers();
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
    this.getViewPlayers();    
  }

  floorChange(){
    console.log(this.selectedFloor);
    this.getViewPlayers();    
  }
  
  addPlayer() {
    let self = this;
    if (this.selectedBuilding == '' || this.selectedBuilding == '0') {
      this.toastrService.error('Please select Building', 'Error!!', {"positionClass": "toast-bottom-right"});
      return;
    }
    if (this.selectedFloor == '' || this.selectedFloor == '0') {
      this.toastrService.error('Please select Floor', 'Error!!', {"positionClass": "toast-bottom-right"});
      return;
    }
    this.router.navigate(['customer/home', { outlets: { popup: ['addplayers', self.selectedBuilding, self.selectedFloor] } }]);
  }

  editPlayer() {
    let self = this;
    if (this.selectedPlayer.length == 1)
    this.router.navigate(['customer/home', { outlets: { popup: ['editplayers', self.selectedPlayer[0]._id] } }]);
  }

  deletePlayer() {
    let self = this;
    if (this.selectedPlayer.length == 1) {
      return this.locationService.removePlayer(this.selectedPlayer[0]._id).then(
        res => {
          self.getPlayers();
        },
        err => {
          console.log(err);
          if (err._body != undefined && err._body != null) {
            self.toastrService.error(err._body, 'Error!!', {"positionClass": "toast-bottom-right"});
          } else {
            self.toastrService.error("Failed to remove Player.", 'Error!!', {"positionClass": "toast-bottom-right"});
          }
        }
      )
    } else {
      self.toastrService.error("Please select a Player.", 'Error!!', {"positionClass": "toast-bottom-right"});
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

  getPlayers(){
    let self = this;
    this.locationService.getPlayer().toPromise().then(
      res => {                
        self.players = res;
        for (let i = 0; i < self.players.length; i++){
          for (let j = 0; j < self.buildings.length; j++){
            if (self.players[i].building_id == self.buildings[j]._id){
              self.players[i].building_name = self.buildings[j].building_name[0].name;
            }
          }
        }
        
        for (let i = 0; i < self.players.length; i++){
          for (let j = 0; j < self.floors.length; j++){
            if (self.players[i].floor_id == self.floors[j]._id){
              self.players[i].floor_name = self.floors[j].short_name;
            }
          }
        }
        console.log(this.players)
        self.viewPlayers = self.players;
        self.selectedPlayer = []; 
      },
      err => {        
        self.toastrService.error('Failed to get player list.', 'Error!!', {"positionClass": "toast-bottom-right"});
      }
    )
  }

  getViewPlayers(){
    if (this.selectedFloor != '' && this.selectedFloor != '0'){
      this.viewPlayers = [];
      for (let i = 0; i < this.players.length; i++){
        if (this.players[i].floor_id == this.selectedFloor){
          this.viewPlayers.push(this.players[i]);
        }
      }
    } else if (this.selectedBuilding != '' && this.selectedBuilding != '0'){
      this.viewPlayers = [];
      for (let i = 0; i < this.players.length; i++){
        if (this.players[i].building_id == this.selectedBuilding){
          this.viewPlayers.push(this.players[i]);
        }
      }
    } else {
      this.viewPlayers = this.players;
    }
    this.selectedPlayer = [];
  }
  
  selectFloor(id) {
    this.selectedFloor = id;
    console.log(this.selectedFloor); 
  }

  selectPlayer(player) {
    player.selected  = !player.selected;
    if (player.selected){
      this.selectedPlayer.push({_id: player._id});
    } else {
      this.selectedPlayer = this.selectedPlayer.filter(item => item._id != player._id);
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
    $('#categoryTable').tableExport({type:'pdf',escape:'false', tableName:'Players'});
  }

  exportToExcel() {
    $('#categoryTable').tableExport({type:'excel',escape:'false', tableName:'Players'});
  }
}


