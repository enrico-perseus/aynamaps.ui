import { Component, OnInit } from '@angular/core';
import { CustomerService } from "../../../../components/auth/customer.service";
import { AuthService } from '../../../../components/auth/auth.service';
import { LocationService } from '../../../../components/auth/location.service';
import { ToastrService } from 'ngx-toastr';
import * as html2canvas from "html2canvas";
import { environment } from "../../../../environments/environment";
import {Subject} from "rxjs/Subject";
import {Http, RequestOptions, Headers, Response} from '@angular/http';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
declare var jquery: any;
declare var $: any;
declare var saveAs: any;

@Component({
  selector: 'app-aynaroutes',
  templateUrl: './aynaroutes.component.html',
  styleUrls: ['./aynaroutes.component.css']
})
export class AynaroutesComponent implements OnInit {

  basePath = environment.basePath;
  authService: AuthService;
  customerService: CustomerService;
  toastrService: ToastrService;
  locationService: LocationService;
  buildings = [];
  floors = [];
  viewFloors = [];
  facilities = [];
  destinations = [];
  pois = [];
  beacons = [];
  players = [];
  flooraccesses = [];
  emergencies = [];
  categories = [];
  currentUser = {};
  selectedBuilding = '0';
  selectedFloor = '0';
  selectedFloorId = '';
  MapType = '';

  search;
  filter;
  aynarouteData = {
    floor_id: '',
    pixel_map: ''
  };
  locations = [{
    id: '',
    name: '',
    LocationType: '',
    status: '',
    floor_id: '',
    x: 0,
    y: 0
  }];

    canvas: any;
    ctx: any;
    width: Number;
    height: Number;
    initW; initH; viewW; viewH; step = 10;
    isDraw = !1;
    makecurve = !1;
    curveinfo = {
      x: 0,
      y: 0,
      x1: 0,
      y1: 0,
      cx: 0,
      cy: 0
    };
    operationType = "";
    startPoint = {
      x: 0,
      y: 0
    };
    savePoint;
    backGround : any;
    bginfo = {
      x: 0,
      y: 0,
      w: 0,
      h: 0,
      otype: '',
      rtype: ''
    };
    prevPos = {
      x: 0,
      y: 0
    };
    dr = 5;
    isSelectedGraph; isSelectedGraph2; selectindex;
    contextinfo = {
      index: 0,
      x: 0,
      y: 0
    };
    contextmenu = !1;
    clipbord = null;
    redraw_index = 0;//!1;
    redraw_enable = !1;
    gridon = !0;
    graphs = [];
    gStep = -1;
    histroys = [];
    hStep = -1;
    curScale = 1;
    lineColor = "#000000";
    canvasImg;

    i: any; /* {
      top: '0px',
      left: '0px',
      visibility: 'visible',
      opacity: '1'
    }; */
    reader = new FileReader;
    locationDownloadNumber = 0;
    resizeTo;
  constructor(private _authService: AuthService,
        private _locationService: LocationService,
        private _toastrSevice: ToastrService,
        private _customerService: CustomerService,
        private http: HttpClient) {

    this.authService = _authService;
    this.locationService = _locationService;
    this.customerService = _customerService;
    this.toastrService = _toastrSevice;

  }

  ngOnInit() {
    this.reset();
    let self = this;
    this.authService.currentUserChanged.subscribe(user => {
      self.currentUser = user;
    //  self.reset();
    });
    $(document).ready(function() {
      $('.all-page-content').css("min-height", $(window).height() - 240);
      $(window).resize(function() {
          $('.all-page-content').css("min-height", $(window).height() - 240);
      });
      $("#searchResult").hide();
      $("#MainDiv").show();

      self.i = $("#menu").css;/* ("top");
      self.i.left = $("#menu").css('left');
      self.i.visibility = $("#menu").css("visibility");
      self.i.opacity = $("#menu").css("opacity"); */


      self.init();
      self.ToolbarAction();
      self.disableIcon();
      self.ctx.save();
      $(window).resize(function(){
        if (self.resizeTo) clearTimeout(self.resizeTo);
        self.resizeTo = setTimeout(function(){
          self.viewResized();
        }, 500);
      });

    });

    /* document.addEventListener ?  */document.addEventListener("click", function(e) {
      $("#menu").css("opacity", "0");
      $("#menu").css("visibility", "hidden");
      $("#menu").hide();
    }, !1) /* : document.attachEvent("onclick", function(e) {
      $("#menu").css("opacity", "0");
      $("#menu").css("visibility", "hidden");
      $("#menu").hide()
    }) */;
  }

  reset() {
    let self = this;
    this.authService.getCurrentUser().then(user => {
      self.currentUser = user;
      this.locations = [];
      self.getBuildings();
      self.getFloors();

      self.getFacilities();
      self.getDestinations();
      self.getPois();
      self.getEmergencies();
      self.getCategories();
      self.getBeacons();
      self.getPlayers();
    });
  }

  getBuildings(){
    let self = this;
    this.customerService.getBuildings().then(
      res => {
        self.buildings = res.json();
        self.selectedBuilding = self.buildings[0].building_id;
      },
      err => {
        self.toastrService.error('Failed to get facility list.', 'Error!!', {"positionClass": "toast-bottom-right"});
      }
    )
  }

  getFloors(){
    let self = this;
    this.customerService.getFloors().then(
      res => {
        self.floors = res.json();
        self.buildingChange();
      },
      err => {
        self.toastrService.error('Failed to get floors list.', 'Error!!', {"positionClass": "toast-bottom-right"});
      }
    )
  }

  getViewFloors(){
    if (this.selectedBuilding != '' && this.selectedBuilding != '0'){
      for (let i = 0; i < this.floors.length; i++){
        if (this.floors[i].building_id == this.selectedBuilding){
          this.viewFloors.push(this.floors[i]);
        }
      }
    } else {
      this.viewFloors = this.floors;
    }
  }

  getDestinations(){
    let self = this;
    this.customerService.getDestinations().then(
      res => {
        self.destinations = res.json();
        self.locationDownloadNumber++;
        console.log(this.destinations)
      },
      err => {
        self.toastrService.error('Failed to get destinations list.', 'Error!!', {"positionClass": "toast-bottom-right"});
      }
    )
  }
  OnSearchTextChanged(){
    // $('.marker').css('display','none');
    // var items = $('.map-list-btn');
    // for (var i = 0 ; i < items.length; i++){
    //   var selector = '.viewport div[value=' + $(items[i]).attr('value') + ']';
    //   $(selector).css('display','block');
    // }
  }
  getViewDestinations(){
    if (this.selectedFloor != '' && this.selectedFloor != '0'){
      for (let i = 0; i < this.destinations.length; i++){
        if (this.destinations[i].floor_id == this.selectedFloor){
          var temp = {
            id: '',
            name: '',
            LocationType: '',
            status: '',
            floor_id: '',
            x:  0,
            y: 0
          };
          temp.id = this.destinations[i]._id;
          temp.name = this.destinations[i].destination_name[0].name;
          temp.LocationType = 'destinations';
          temp.status = this.destinations[i].status;
          temp.floor_id = this.destinations[i].floor_id;
          temp.x = this.destinations[i].latitude;
          temp.y = this.destinations[i].longitude;
          this.locations.push(temp);
        }
      }
    } else if (this.selectedBuilding != '' && this.selectedBuilding != '0'){
      for (let i = 0; i < this.destinations.length; i++){
        if (this.destinations[i].building_id == this.selectedBuilding){
          var temp = {
            id: '',
            name: '',
            LocationType: '',
            status: '',
            floor_id: '',
            x:  0,
            y: 0
          };
          temp.id = this.destinations[i]._id;
          temp.name = this.destinations[i].destination_name[0].name;
          temp.LocationType = 'destinations';
          temp.status = this.destinations[i].status;
          temp.floor_id = this.destinations[i].floor_id;
          temp.x = this.destinations[i].latitude;
          temp.y = this.destinations[i].longitude;
          this.locations.push(temp);
        }
      }
    } else {
      for (let i = 0; i < this.destinations.length; i++){
          var temp = {
            id: '',
            name: '',
            LocationType: '',
            status: '',
            floor_id: '',
            x:  0,
            y: 0
          };
          temp.id = this.destinations[i]._id;
          temp.name = this.destinations[i].destination_name[0].name;
          temp.LocationType = 'destinations';
          temp.status = this.destinations[i].status;
          temp.floor_id = this.destinations[i].floor_id;
          temp.x = this.destinations[i].latitude;
          temp.y = this.destinations[i].longitude;
          this.locations.push(temp);
      }
    }
  }

  getCategories() {
    let self = this;
    this.locationService.getCategory().toPromise()
    .then(
      categories => {
        //self.selectedCategories = [];
        self.categories = categories;
      },
      err => {
        console.log(err);
      }
    )
  }

  getEmergencies(){
    let self = this;
    this.customerService.getEmergencies().then(
      res => {
        self.emergencies = res.json();
        self.locationDownloadNumber++;
        console.log(this.emergencies)
      },
      err => {
        self.toastrService.error('Failed to get emergencies list.', 'Error!!', {"positionClass": "toast-bottom-right"});
      }
    )
  }

  getViewEmergencies(){
    if (this.selectedFloor != '' && this.selectedFloor != '0'){
      for (let i = 0; i < this.emergencies.length; i++){
        if (this.emergencies[i].floor_id == this.selectedFloor){
          var temp = {
            id: '',
            name: '',
            LocationType: '',
            status: '',
            floor_id: '',
            x:  0,
            y: 0
          };
          temp.id = this.emergencies[i]._id;
          temp.name = this.emergencies[i].emergency_name[0].name;
          temp.LocationType = 'emergencies';
          temp.status = this.emergencies[i].status;
          temp.floor_id = this.emergencies[i].floor_id;
          temp.x = this.emergencies[i].latitude;
          temp.y = this.emergencies[i].longitude;
          this.locations.push(temp);
        }
      }
    } else if (this.selectedBuilding != '' && this.selectedBuilding != '0'){
      for (let i = 0; i < this.emergencies.length; i++){
        if (this.emergencies[i].building_id == this.selectedBuilding){
          var temp = {
            id: '',
            name: '',
            LocationType: '',
            status: '',
            floor_id: '',
            x:  0,
            y: 0
          };
          temp.id = this.emergencies[i]._id;
          temp.name = this.emergencies[i].emergency_name[0].name;
          temp.LocationType = 'emergencies';
          temp.status = this.emergencies[i].status;
          temp.floor_id = this.emergencies[i].floor_id;
          temp.x = this.emergencies[i].latitude;
          temp.y = this.emergencies[i].longitude;
          this.locations.push(temp);
        }
      }
    } else {
      for (let i = 0; i < this.emergencies.length; i++){
          var temp = {
            id: '',
            name: '',
            LocationType: '',
            status: '',
            floor_id: '',
            x:  0,
            y: 0
          };
          temp.id = this.emergencies[i]._id;
          temp.name = this.emergencies[i].emergency_name[0].name;
          temp.LocationType = 'emergencies';
          temp.status = this.emergencies[i].status;
          temp.floor_id = this.emergencies[i].floor_id;
          temp.x = this.emergencies[i].latitude;
          temp.y = this.emergencies[i].longitude;
          this.locations.push(temp);
        }
    }
  }

  getFacilities(){
    let self = this;
    this.customerService.getFacilities().then(
      res => {
        self.facilities = res.json();
        self.locationDownloadNumber++;
        console.log(this.facilities)
      },
      err => {
        self.toastrService.error('Failed to get floors list.', 'Error!!', {"positionClass": "toast-bottom-right"});
      }
    )
  }

  getViewFacilities(){
    if (this.selectedFloor != '' && this.selectedFloor != '0'){
      for (let i = 0; i < this.facilities.length; i++){
        if (this.facilities[i].floor_id == this.selectedFloor){
          var temp = {
            id: '',
            name: '',
            LocationType: '',
            status: '',
            floor_id: '',
            x:  0,
            y: 0
          };
          temp.id = this.facilities[i]._id;
          temp.name = this.facilities[i].facility_name[0].name;
          temp.LocationType = 'facilities';
          temp.status = this.facilities[i].status;
          temp.floor_id = this.facilities[i].floor_id;
          temp.x = this.facilities[i].latitude;
          temp.y = this.facilities[i].longitude;
          this.locations.push(temp);
        }
      }
    } else if (this.selectedBuilding != '' && this.selectedBuilding != '0'){
      for (let i = 0; i < this.facilities.length; i++){
        if (this.facilities[i].building_id == this.selectedBuilding){
          var temp = {
            id: '',
            name: '',
            LocationType: '',
            status: '',
            floor_id: '',
            x : 0,
            y : 0
          };
          temp.id = this.facilities[i]._id;
          temp.name = this.facilities[i].facility_name[0].name;
          temp.LocationType = 'facilities';
          temp.status = this.facilities[i].status;
          temp.floor_id = this.facilities[i].floor_id;
          temp.x= this.facilities[i].latitude;
          temp.y = this.facilities[i].longitude;
          this.locations.push(temp);
        }
      }
    } else {
      for (let i = 0; i < this.facilities.length; i++){
          var temp = {
            id: '',
            name: '',
            LocationType: '',
            status: '',
            floor_id: '',
            x: 0,
            y: 0
          };
          temp.id = this.facilities[i]._id;
          temp.name = this.facilities[i].facility_name[0].name;
          temp.LocationType = 'facilities';
          temp.status = this.facilities[i].status;
          temp.floor_id = this.facilities[i].floor_id;
          temp.x= this.facilities[i].latitude;
          temp.y = this.facilities[i].longitude;
          this.locations.push(temp);
      }
    }
  }

  getPois(){
    let self = this;
    this.customerService.getPois().then(
      res => {
        self.pois = res.json();
        self.locationDownloadNumber++;
        console.log(this.pois)
      },
      err => {
        self.toastrService.error('Failed to get floors list.', 'Error!!', {"positionClass": "toast-bottom-right"});
      }
    )
  }

  getViewPois(){
    if (this.selectedFloor != '' && this.selectedFloor != '0'){
      for (let i = 0; i < this.pois.length; i++){
        if (this.pois[i].floor_id == this.selectedFloor){
          var temp = {
            id: '',
            name: '',
            LocationType: '',
            status: '',
            floor_id: '',
            x: 0,
            y:0
          };
          temp.id = this.pois[i]._id;
          temp.name = this.pois[i].poi_name[0].name;
          temp.LocationType = 'pois';
          temp.status = this.pois[i].status;
          temp.floor_id = this.pois[i].floor_id;
          temp.x = this.pois[i].latitude;
          temp.y = this.pois[i].longitude;
          this.locations.push(temp);
        }
      }
    } else if (this.selectedBuilding != '' && this.selectedBuilding != '0'){
      for (let i = 0; i < this.pois.length; i++){
        if (this.pois[i].building_id == this.selectedBuilding){
          var temp = {
            id: '',
            name: '',
            LocationType: '',
            status: '',
            floor_id: '',
            x: 0,
            y:0
          };
          temp.id = this.pois[i]._id;
          temp.name = this.pois[i].poi_name[0].name;
          temp.LocationType = 'pois';
          temp.status = this.pois[i].status;
          temp.floor_id = this.pois[i].floor_id;
          temp.x = this.pois[i].latitude;
          temp.y = this.pois[i].longitude;
          this.locations.push(temp);
        }
      }
    } else {
      for (let i = 0; i < this.pois.length; i++){
          var temp = {
            id: '',
            name: '',
            LocationType: '',
            status: '',
            floor_id: '',
            x: 0,
            y:0
          };
          temp.id = this.pois[i]._id;
          temp.name = this.pois[i].poi_name[0].name;
          temp.LocationType = 'pois';
          temp.status = this.pois[i].status;
          temp.floor_id = this.pois[i].floor_id;
          temp.x = this.pois[i].latitude;
          temp.y = this.pois[i].longitude;
          this.locations.push(temp);
      }
    }
  }
  getPlayers(){
    let self = this;
    this.locationService.getPlayer().toPromise().then(
      res => {
        self.players = res;
        self.locationDownloadNumber++;
      },
      err => {
        self.toastrService.error('Failed to get Player list.', 'Error!!', {"positionClass": "toast-bottom-right"});
      }
    )
  }
  getViewPlayers(){
    if (this.selectedFloor != '' && this.selectedFloor != '0'){
      for (let i = 0; i < this.players.length; i++){
        if (this.players[i].floor_id == this.selectedFloor){
          var temp = {
            id: '',
            name: '',
            LocationType: '',
            status: '',
            floor_id: '',
            x: 0,
            y:0
          };
          temp.id = this.players[i]._id;
          temp.name = this.players[i].player_code;
          temp.LocationType = 'player';
          temp.status = this.players[i].status;
          temp.floor_id = this.players[i].floor_id;
          temp.x = this.players[i].latitude;
          temp.y = this.players[i].longitude;
          this.locations.push(temp);
        }
      }
    } else if (this.selectedBuilding != '' && this.selectedBuilding != '0'){
      for (let i = 0; i < this.players.length; i++){
        if (this.players[i].building_id == this.selectedBuilding){
          var temp = {
            id: '',
            name: '',
            LocationType: '',
            status: '',
            floor_id: '',
            x: 0,
            y:0
          };
          temp.id = this.players[i]._id;
          temp.name = this.players[i].player_code;
          temp.LocationType = 'player';
          temp.status = this.players[i].status;
          temp.floor_id = this.players[i].floor_id;
          temp.x = this.players[i].latitude;
          temp.y = this.players[i].longitude;
          this.locations.push(temp);
        }
      }
    } else {
      for (let i = 0; i < this.players.length; i++){
          var temp = {
            id: '',
            name: '',
            LocationType: '',
            status: '',
            floor_id: '',
            x: 0,
            y:0
          };
          temp.id = this.players[i]._id;
        temp.name = this.players[i].player_code;
          temp.LocationType = 'player';
          temp.status = this.players[i].status;
          temp.floor_id = this.players[i].floor_id;
          temp.x = this.players[i].latitude;
          temp.y = this.players[i].longitude;
          this.locations.push(temp);
      }
    }
  }
  getBeacons(){
    let self = this;
    this.customerService.getBeacons().then(
      res => {
        self.beacons = res.json();
        self.locationDownloadNumber++;
      },
      err => {
        self.toastrService.error('Failed to get beacons list.', 'Error!!', {"positionClass": "toast-bottom-right"});
      }
    )
  }
  getViewBeacons(){
    if (this.selectedFloor != '' && this.selectedFloor != '0'){
      for (let i = 0; i < this.beacons.length; i++){
        if (this.beacons[i].floor_id == this.selectedFloor){
          var temp = {
            id: '',
            name: '',
            LocationType: '',
            status: '',
            floor_id: '',
            x: 0,
            y:0
          };
          temp.id = this.beacons[i]._id;
          temp.name = this.beacons[i].beacon_code;
          temp.LocationType = 'beacon';
          temp.status = this.beacons[i].status;
          temp.floor_id = this.beacons[i].floor_id;
          temp.x = this.beacons[i].latitude;
          temp.y = this.beacons[i].longitude;
          this.locations.push(temp);
        }
      }
    } else if (this.selectedBuilding != '' && this.selectedBuilding != '0'){
      for (let i = 0; i < this.beacons.length; i++){
        if (this.beacons[i].building_id == this.selectedBuilding){
          var temp = {
            id: '',
            name: '',
            LocationType: '',
            status: '',
            floor_id: '',
            x: 0,
            y:0
          };
          temp.id = this.beacons[i]._id;
          temp.name = this.beacons[i].beacon_code;
          temp.LocationType = 'beacon';
          temp.status = this.beacons[i].status;
          temp.floor_id = this.beacons[i].floor_id;
          temp.x = this.beacons[i].latitude;
          temp.y = this.beacons[i].longitude;
          this.locations.push(temp);
        }
      }
    } else {
      for (let i = 0; i < this.beacons.length; i++){
          var temp = {
            id: '',
            name: '',
            LocationType: '',
            status: '',
            floor_id: '',
            x: 0,
            y:0
          };
          temp.id = this.beacons[i]._id;
          temp.name = this.beacons[i].beacon_code;
          temp.LocationType = 'beacon';
          temp.status = this.beacons[i].status;
          temp.floor_id = this.beacons[i].floor_id;
          temp.x = this.beacons[i].latitude;
          temp.y = this.beacons[i].longitude;
          this.locations.push(temp);
      }
    }
  }
  getFloorAccesses(){
    // let self = this;
    // this.customerService.getFloorAccessesbyBuildingId(self.selectedBuilding).then(
    //   res => {
    //     self.flooraccesses = res.json();
    //     self.locationDownloadNumber++;
    //   },
    //   err => {
    //     self.toastrService.error('Failed to get flooraccess list.', 'Error!!', {"positionClass": "toast-bottom-right"});
    //   }
    // )
  }
  getViewFloorAccesses(){
      // if (this.selectedFloor != '' && this.selectedFloor != '0'){
      // for (let i = 0; i < this.flooraccesses.length; i++){
      //   for (let j = 0; j < this.flooraccesses[i].floor_id_from.length ; j++){
      //     if (this.flooraccesses[i].floor_id_from[j] == this.selectedFloorId ){
      //     var temp = {
      //       id: '',
      //       name: '',
      //       LocationType: '',
      //       status: '',
      //       floor_id: '',
      //       x: 0,
      //       y:0
      //     };
          // temp.id = this.flooraccesses[i]._id;
          // temp.name = this.flooraccesses[i].flooraccess_code;
          // temp.LocationType = 'flooraccess';
          // temp.status = this.flooraccesses[i].status;
          // temp.floor_id = this.selectedFloor;
          // temp.x = this.flooraccesses[i].flooraccess_position.fromlatitude;
          // temp.y = this.flooraccesses[i].fromlongitude;
          // this.locations.push(temp);
          // temp.x = this.flooraccesses[i].tolatitude;
          // temp.y = this.flooraccesses[i].tolongitude;
          // this.locations.push(temp);
    //     }
    //     }

    //   }
    // } else if (this.selectedBuilding != '' && this.selectedBuilding != '0'){
    //   for (let i = 0; i < this.flooraccesses.length; i++){
    //     if (this.flooraccesses[i].building_id == this.selectedBuilding){
    //       var temp = {
    //         id: '',
    //         name: '',
    //         LocationType: '',
    //         status: '',
    //         floor_id: '',
    //         x: 0,
    //         y:0
    //       };
    //       temp.id = this.flooraccesses[i]._id;
    //       temp.name = this.flooraccesses[i].flooraccess_code;
    //       temp.LocationType = 'flooraccess';
    //       temp.status = this.flooraccesses[i].status;
    //       temp.floor_id = this.flooraccesses[i].floor_id;
    //       temp.x = this.flooraccesses[i].fromlatitude;
    //       temp.y = this.flooraccesses[i].fromlongitude;
    //       this.locations.push(temp);
    //       temp.x = this.flooraccesses[i].tolatitude;
    //       temp.y = this.flooraccesses[i].tolongitude;
    //       this.locations.push(temp);
    //     }
    //   }
    // } else {
    //   for (let i = 0; i < this.beacons.length; i++){
    //       var temp = {
    //         id: '',
    //         name: '',
    //         LocationType: '',
    //         status: '',
    //         floor_id: '',
    //         x: 0,
    //         y:0
    //       };
    //       temp.id = this.beacons[i]._id;
    //       temp.name = this.beacons[i].beacon_code;
    //       temp.LocationType = 'beacon';
    //       temp.status = this.beacons[i].status;
    //       temp.floor_id = this.beacons[i].floor_id;
    //       temp.x = this.beacons[i].latitude;
    //       temp.y = this.beacons[i].longitude;
    //       this.locations.push(temp);
    //   }
    // }
  }
  buildingChange(){
    console.log(this.selectedBuilding);
    this.viewFloors = [];
    this.locations = [];
    this.getViewFloors();
    this.selectedFloor = this.viewFloors[0].short_name;
    for (var i = 0; i < this.viewFloors.length; i++){
      if (this.selectedFloor == this.viewFloors[i].short_name)
        this.selectedFloorId = this.viewFloors[i]._id;
    }
    this.floorChange();
  }

  floorChange(){
    console.log(this.selectedFloor);
    this.locations = [];
    for (var i = 0; i < this.viewFloors.length; i++){
      if (this.selectedFloor == this.viewFloors[i].short_name)
        this.selectedFloorId = this.viewFloors[i]._id;
    }
    this.RouteSelected(this.selectedFloor);

  }

  straightClick(){
    console.log("straight line");
    this.canvas.style.cursor = "crosshair";
    this.operationType = "line";
    this.lineColor = "#000000";
  }

  curveClick(){
    console.log("curve line");
    this.canvas.style.cursor = "crosshair";
    this.operationType = "curve";
    this.lineColor = "#000000";
    this.makecurve && (this.makecurve = !1)
  }

  bindEvent() {

    let self = this;

    this.canvas.addEventListener("mousedown", function(e) {
        self.eventDown(e);
     }, !1);

    this.canvas.addEventListener("mousemove", function(e) {
      self.eventMove(e);
    }, !1);

    this.canvas.addEventListener("mouseup", function(e) {
      self.eventUp(e);
    }, !1);

    this.canvas.addEventListener("dblclick", function(e) {
      self.dblEvent(e)
    }, !1);

    this.canvas.addEventListener("mouseout", function(e) {
      self.leaveEvent(e);
    }, !1);

    this.canvas.addEventListener("mousewheel", function(e) {
      self.MouseWheelEvent(e);
    }, !1);

    this.canvas.addEventListener("DOMMouseScroll", function(e) {
      self.MouseWheelEvent(e);
    }, !1);

    this.canvas.addEventListener("contextmenu", function(e) {
      self.handleContextMenu(e)
    }, !1);

    document.getElementById("background").addEventListener("change", function(e) {
      self.setBackground(e)
    }, !1);

  }

  eventDown(e) {
    if (e || (e = event || window.event), this.detectLeftButton(e)) {
      this.isDraw = !0;
      var t = this.getGridpos({ x: e.offsetX / this.curScale, y: e.offsetY / this.curScale });
      switch (this.prevPos.x = e.offsetX / this.curScale,
          this.prevPos.y = e.offsetY / this.curScale,
          this.savePoint && this.ctx.putImageData(this.savePoint, 0, 0),
          this.redraw_enable && (this.redraw_index = this.isRedraw(this.prevPos.x, this.prevPos.y),
          this.redraw_index > 0 && (this.operationType = "redraw",
          this.canvas.style.cursor = "pointer",
          this.reDrawAll(this.gStep - 1, 1),
          this.savePoint = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height),
          this.draw(this.graphs[this.gStep]),
          this._selectCircle(this.graphs[this.gStep], 3))),
          this.startPoint = {x: 0, y: 0}, this.operationType) {
        case "line":
            this.savePoint = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height),
                              this.startPoint.x = t.x, this.startPoint.y = t.y; break;
        case "curve":
            this.makecurve || (this.savePoint = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height),
            this.startPoint.x = t.x, this.startPoint.y = t.y); break;
        case "copy":
            this.savePoint = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height); for (var a = 0; this.gStep >= a; a++)
                if (this.isPointInObject(this.graphs[a], e.offsetX / this.curScale, e.offsetY / this.curScale)) {
                  this.isSelectedGraph = {},
                  this.isSelectedGraph.type = this.graphs[a].type,
                  this.isSelectedGraph.x = this.graphs[a].x,
                  this.isSelectedGraph.y = this.graphs[a].y,
                  this.isSelectedGraph.x1 = this.graphs[a].x1,
                  this.isSelectedGraph.y1 = this.graphs[a].y1,
                  this.isSelectedGraph.cx = this.graphs[a].cx,
                  this.isSelectedGraph.cy = this.graphs[a].cy,
                  this.isSelectedGraph.color = this.graphs[a].color,
                  this.canvas.style.cursor = "move",
                  this._selectCircle(this.isSelectedGraph, 3);
                  break }
            break;
        case "delete":
            for (var a = 0; this.gStep >= a; a++)
                if (this.isPointInObject(this.graphs[a], e.offsetX / this.curScale, e.offsetY / this.curScale)) {
                  this.isSelectedGraph = this.graphs.splice(a, 1)[0], this.selectindex = a, this.gStep--;
                  break
                }
            break;
        case "breaker":
            this.savePoint = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
            for (var a = 0; this.gStep >= a; a++)
                if (this.isPointInObject(this.graphs[a], e.offsetX / this.curScale, e.offsetY / this.curScale)) {
                  this.isSelectedGraph = this.graphs.splice(a, 1)[0],
                  this._selectCircle(this.isSelectedGraph, 3), this.selectindex = a, this.gStep--;
                  break
                }
            break;
        case "move":
            this.savePoint = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
            for (var a = 0; this.gStep >= a; a++)
                if (this.isPointInObject(this.graphs[a], e.offsetX / this.curScale, e.offsetY / this.curScale)) {
                  this.isSelectedGraph = this.graphs.splice(a, 1)[0], this.selectindex = a,
                  this.isSelectedGraph2 = this.graphClone(this.isSelectedGraph),
                  this.gStep--,
                  this.reDrawAll(this.gStep, 1),
                  this.canvas.style.cursor = "move",
                  this.savePoint = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height), this.draw(this.isSelectedGraph),
                  this._selectCircle(this.isSelectedGraph, 3);
                  break
                }
            break;
        case "setbackground":
            this.backGround && (t.x - this.bginfo.x > this.dr && t.x - this.bginfo.x < this.bginfo.w - this.dr &&
              t.y - this.bginfo.y > this.dr && t.y - this.bginfo.y < this.bginfo.h - this.dr ?
              (this.reDrawAll(this.gStep, !1),
              this.savePoint = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height),
              this.ctx.drawImage(this.backGround, this.bginfo.x, this.bginfo.y, this.bginfo.w, this.bginfo.h),
              this.drawSelectRect(this.bginfo, 3), this.canvas.style.cursor = "move",
              this.bginfo.otype = "move") : Math.abs(this.bginfo.x -this.prevPos.x) < this.dr && Math.abs(this.bginfo.y - this.prevPos.y) < this.dr ?
              (this.reDrawAll(this.gStep, !1), this.savePoint = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height),
              this.ctx.drawImage(this.backGround, this.bginfo.x, this.bginfo.y, this.bginfo.w, this.bginfo.h),
              this.drawSelectRect(this.bginfo, 3), this.canvas.style.cursor = "nw-resize",
              this.bginfo.otype = "resize", this.bginfo.rtype = "TL") :
              Math.abs(this.bginfo.x + this.bginfo.w - this.prevPos.x) < this.dr && Math.abs(this.bginfo.y + this.bginfo.h - this.prevPos.y) < this.dr ?
              (this.reDrawAll(this.gStep, !1), this.savePoint = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height),
              this.ctx.drawImage(this.backGround, this.bginfo.x, this.bginfo.y, this.bginfo.w, this.bginfo.h), this.drawSelectRect(this.bginfo, 3),
              this.canvas.style.cursor = "nw-resize", this.bginfo.otype = "resize", this.bginfo.rtype = "BR") :
              Math.abs(this.bginfo.x - this.prevPos.x) < this.dr && Math.abs(this.bginfo.y + this.bginfo.h - this.prevPos.y) < this.dr ?
              (this.reDrawAll(this.gStep, !1), this.savePoint = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height),
              this.ctx.drawImage(this.backGround, this.bginfo.x, this.bginfo.y, this.bginfo.w, this.bginfo.h), this.drawSelectRect(this.bginfo, 3),
              this.canvas.style.cursor = "ne-resize", this.bginfo.otype = "resize", this.bginfo.rtype = "BL") :
              Math.abs(this.bginfo.x + this.bginfo.w - this.prevPos.x) < this.dr && Math.abs(this.bginfo.y - this.prevPos.y) < this.dr ?
              (this.reDrawAll(this.gStep, !1), this.savePoint = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height),
              this.ctx.drawImage(this.backGround, this.bginfo.x, this.bginfo.y, this.bginfo.w, this.bginfo.h),
              this.drawSelectRect(this.bginfo, 3), this.canvas.style.cursor = "ne-resize",
              this.bginfo.otype = "resize", this.bginfo.rtype = "TR") :
              Math.abs(this.bginfo.x - this.prevPos.x) < this.dr && Math.abs(this.bginfo.y + this.bginfo.h / 2 - this.prevPos.y) < this.dr ?
              (this.reDrawAll(this.gStep, !1), this.savePoint = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height),
              this.ctx.drawImage(this.backGround, this.bginfo.x, this.bginfo.y, this.bginfo.w, this.bginfo.h),
              this.drawSelectRect(this.bginfo, 3), this.canvas.style.cursor = "e-resize", this.bginfo.otype = "resize", this.bginfo.rtype = "LM") :
              Math.abs(this.bginfo.x + this.bginfo.w - this.prevPos.x) < this.dr && Math.abs(this.bginfo.y + this.bginfo.h / 2 - this.prevPos.y) < this.dr ?
              (this.reDrawAll(this.gStep, !1), this.savePoint = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height),
              this.ctx.drawImage(this.backGround, this.bginfo.x, this.bginfo.y, this.bginfo.w, this.bginfo.h), this.drawSelectRect(this.bginfo, 3),
              this.canvas.style.cursor = "e-resize", this.bginfo.otype = "resize", this.bginfo.rtype = "RM") :
              Math.abs(this.bginfo.x + this.bginfo.w / 2 - this.prevPos.x) < this.dr && Math.abs(this.bginfo.y - this.prevPos.y) < this.dr ?
              (this.reDrawAll(this.gStep, !1), this.savePoint = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height),
              this.ctx.drawImage(this.backGround, this.bginfo.x, this.bginfo.y, this.bginfo.w, this.bginfo.h), this.drawSelectRect(this.bginfo, 3),
              this.canvas.style.cursor = "n-resize", this.bginfo.otype = "resize", this.bginfo.rtype = "TM") :
              Math.abs(this.bginfo.x + this.bginfo.w / 2 - this.prevPos.x) < this.dr &&
              Math.abs(this.bginfo.y + this.bginfo.h - this.prevPos.y) < this.dr &&
              (this.reDrawAll(this.gStep, !1),
              this.savePoint = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height),
              this.ctx.drawImage(this.backGround, this.bginfo.x, this.bginfo.y, this.bginfo.w, this.bginfo.h),
              this.drawSelectRect(this.bginfo, 3), this.canvas.style.cursor = "n-resize",
              this.bginfo.otype = "resize", this.bginfo.rtype = "BM"))
      }
    }
  }

  eventMove(e) {
    if (e || (e = event || window.event), this.showCoordinates(e), this.resizeImgCursor(e), this.detectLeftButton(e))
      switch (this.operationType) {
        case "line":
            this.lineEventMove(e); break;
        case "curve":
            this.makecurve ? this.curveEventMove(e) : this.lineEventMove(e); break;
        case "copy":
            this.copyEventMove(e); break;
        case "move":
            this.moveEventMove(e); break;
        case "setbackground":
            this.moveBackgroud(e); break;
        case "redraw":
            this.redrawMove(e)
      }
  }

  eventUp(e) {
    switch (e || (e = event || window.event), this.operationType) {
      case "line":
          this.lineEventUp(e); break;
      case "curve":
          this.curveEvenUp(e); break;
      case "copy":
          this.copyEventUp(e); break;
      case "move":
          this.moveEventUp(e); break;
      case "delete":
          this.deleteEventUp(e); break;
      case "breaker":
          this.breakerEventUp(e); break;
      case "setbackground":
          this.backGroundUp(e); break;
      case "redraw":
          this.redrawUp(e)
    }
    this.disableIcon()
  }

  dblEvent(e) { e || (e = event || window.event) }

  leaveEvent(e) {
    if (e || (e = event || window.event), this.detectLeftButton(e) && !this.contextmenu)
    switch (this.operationType) {
    case "line":
        this.lineEventUp(e); break;
    case "curve":
        this.curveEvenUp(e); break;
    case "copy":
        this.copyEventUp(e)
    }
  }

  MouseWheelEvent(e) {
    e || (e = event || window.event); var t = e.wheelDelta || -1 * e.detail;
    t / 120 > 0 ? (this.zoomin(.08), console.log("+"), console.log(t / 120)) :
    (this.zoomout(.08), console.log("-"), console.log(t)), e.preventDefault && e.preventDefault()
  }

  handleContextMenu(e) {
    e || (e = event || window.event), this.contextmenu = !0, this.ctx.putImageData(this.savePoint, 0, 0);
    var t = e.clientX;
    var a = e.clientY;
    $("#rBreaker").show(); $("#rDisable").show(); $("#rNormal").show(); $("#rDelete").show(); $("#rCopy").show(); $("#rPaste").show();
    for (var r = 0; this.gStep >= r; r++)
    if (this.isPointInObject(this.graphs[r], e.offsetX / this.curScale, e.offsetY / this.curScale))
      return this.contextinfo = {index: 0, x: 0, y: 0},
      this.contextinfo.index = r,
      this.contextinfo.x = e.offsetX / this.curScale,
      this.contextinfo.y = e.offsetY / this.curScale,
      this.isDraw = !0,
      this._selectCircle(this.graphs[r], 3),
      this.menu(t, a), this.clipbord || $("#rPaste").hide(), "#0000ff" == this.graphs[r].color ?
        $("#rDisable").hide() : $("#rNormal").hide(), void e.preventDefault();
      this.clipbord && (this.contextinfo = {index: 0, x: 0, y: 0}, this.contextinfo.x = e.offsetX / this.curScale,
      this.contextinfo.y = e.offsetY / this.curScale, this.isDraw = !0,
      $("#rBreaker").hide(), $("#rDisable").hide(), $("#rDelete").hide(), $("#rCopy").hide(), this.menu(t, a))
    }

    setBackground(e) {
      let self = this;
      this.reader.onload = function(e) {
        self.backGround = new Image; var t, a, r, i;
        self.backGround.onload = function() {
          t = this.width, a = this.height, r = $("#view").height(), i = $("#view").width(); var e, c;
          e = (i - t) / 2, c = (r - a) / 2,
          this.bginfo.x = 0, this.bginfo.y = 0, this.bginfo.w = Math.round(t / this.step) * this.step,
          this.bginfo.h = Math.round(a / this.step) * this.step, this.operationType = "setbackground",
          this.reDrawAll(this.gStep, !0), this.savePoint = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height),
          this.drawSelectRect(this.bginfo, 3) }, self.backGround.src = e.target['result'] },
          this.reader.readAsDataURL(e.target.files[0])
    }

    ToolbarAction() {
      let self = this;
      var e, t = document.getElementsByClassName("toolbar_icon");
      for (e = 0; e < t.length; e++)
      t[e]['onclick'] = function(e) {
        if ($(".active-picker").hasClass('hand-box') && !$(this).hasClass('hand-box')){
          let this1= this;
           $('body').append('<div id="waiting">Waiting...</div>');
           $('#waiting').attr('style', $("div.viewport").attr('style'));
          $('#waiting').css('opacity',0.7);
          $('#waiting').css('background-color','#000000');
          $('#waiting').css('z-index',100);
          $('#waiting').css('color', '#FFF');
          $('#waiting').css('text-align','center');
          $('#waiting').css('padding-top','200px');
          $('#waiting').css('font-size','25px');
          html2canvas($("div.viewport").get(0),{useCORS : true, logging: false}).then(function(canvas){
            $('#waiting').remove();
            self.ctx = canvas.getContext('2d');
            $(".active-picker").removeClass('active-picker');
            $(this1).addClass('active-picker');
            if ($('.active-picker').hasClass('hand-box'))
            {
              self.canvasImg.imgNotes("option","zoomable", true);
              self.canvasImg.imgNotes("option","dragable", true);
            }else {
              self.canvasImg.imgNotes("option","zoomable", false);
              self.canvasImg.imgNotes("option","dragable", false);
            }
          });
        } else{
          $(".active-picker").removeClass('active-picker');
          $(this).addClass('active-picker');
          if ($('.active-picker').hasClass('hand-box'))
          {
            self.canvasImg.imgNotes("option","zoomable", true);
            self.canvasImg.imgNotes("option","dragable", true);
          }else {
            self.canvasImg.imgNotes("option","zoomable", false);
            self.canvasImg.imgNotes("option","dragable", false);
          }
        }
      }
    }

    ToolbarDeactive() {
      var e, t = document.getElementsByClassName("toolbar_icon");
      for (e = 0; e < t.length; e++) t[e]['style'].backgroundColor = "white"
    }



  getGridpos(e) {
    var t = Math.round(e.x / this.step) * this.step;
    var a = Math.round(e.y / this.step) * this.step;
    return { x: t, y: a }
  }

  detectLeftButton(e) {
    if (e = e || window.event, "buttons" in e) {
      return 1 == e.buttons;
    }
    var t = e.which || e.button;
    return 1 == t
  }

  isRedraw(e, t) {
    var a = this.graphs[this.gStep];
    return Math.abs(a.x - e) < this.dr && Math.abs(a.y - t) < this.dr ? 1 : Math.abs(a.x1 - e) < this.dr && Math.abs(a.y1 - t) < this.dr ? 2 : 0
  }

  reDrawAll(e, t) {
    t = "undefined" != typeof t ? t : !0,
    this.ctx.clearRect(0, 0, this.width, this.height),
    this.backGround && t && this.ctx.drawImage(this.backGround, this.bginfo.x, this.bginfo.y, this.bginfo.w, this.bginfo.h),
    this.gridon, e > this.graphs.length && (e = this.graphs.length - 1);
    for (var a = 0; e >= a; a++) this.draw(this.graphs[a])
  }

  draw(e) {
    if (e.type)
      switch (e.type) {
        case "line":
            this._drawLine(e); break;
        case "curve":
            this._drawCurve(e)
      }
  }

  _selectCircle(e, t) {
    this.ctx.beginPath(),
    this.ctx.arc(e.x, e.y, t, 0, 2 * Math.PI, !1),
    this.ctx.strokeStyle = "#000000",
    this.ctx.fillStyle = "#ffffff",
    this.ctx.stroke(),
    this.ctx.fill(),
    this.ctx.closePath(),
    this.ctx.beginPath(),
    this.ctx.arc(e.x1, e.y1, t, 0, 2 * Math.PI, !1),
    this.ctx.strokeStyle = "#000000",
    this.ctx.fillStyle = "#ffffff",
    this.ctx.stroke(),
    this.ctx.fill(), this.ctx.closePath()
  }

  isPointInObject(e, t, a) {
    if ("curve" == e.type) {
      this.savePoint = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height),
      this.draw(e); var r = this.ctx.isPointInPath(t * this.curScale, a * this.curScale);
      return this.ctx.putImageData(this.savePoint, 0, 0), r
    }
    return "line" == e.type ? this.isNearLine(e, t, a) : void 0
  }

  graphClone(e) {
    var t = {
      y: 0,
      x: 0,
      x1: 0,
      y1: 0,
      cx: 0,
      cy: 0,
      color: '',
      type: ''
    };
    return t.type = e.type, t.x = e.x, t.y = e.y, t.x1 = e.x1, t.y1 = e.y1, t.cx = e.cx, t.cy = e.cy, t.color = e.color, t
  }


  init() {
      this.canvas = document.getElementById("mycanvas");
      this.ctx = this.canvas.getContext("2d");
      this.width = $("#mycanvas").width();
      this.height = $("#mycanvas").height();
      this.initW = this.width;
      this.initH = this.height;
      this.viewH = $("#view").height();
      this.viewW = $("#view").width();
      this.ctx.canvas.width = this.width;
      this.ctx.canvas.height = this.height
  };

  drawGrid() {
    for (var e = $("#mycanvas").width(), t = $("#mycanvas").height(), a = 0; e >= a; a += this.step)
        for (var r = 0; t >= r; r += this.step) {
        this.ctx.beginPath();
        this.ctx.arc(a, r, .5, 0, 2 * Math.PI, !1);
        this.ctx.fillStyle = "#000000"
        this.ctx.fill()
    }
  }

  drawRect(e, t, a) {
    this.ctx.beginPath();
    this.ctx.rect(e - a, t - a, 2 * a, 2 * a)
    this.ctx.strokeStyle = "#000000"
    this.ctx.fillStyle = "#ffffff"
    this.ctx.stroke();
    this.ctx.fill();
  }

  drawCricle(e, t, a) {
    this.ctx.beginPath(),
    this.ctx.arc(e, t, a, 0, 2 * Math.PI, !1),
    this.ctx.strokeStyle = "#000000",
    this.ctx.fillStyle = "#ffffff",
    this.ctx.stroke(),
    this.ctx.fill()
  }

  drawSelectRect(e, t) {
    this.ctx.beginPath(),
    this.ctx.strokeStyle = "#4d7399",
    this.ctx.lineWidth = 2,
    this.ctx.rect(e.x, e.y, e.w, e.h),
    this.ctx.stroke(),
    this.drawCricle(e.x, e.y, t),
    this.drawCricle(e.x + e.w, e.y, t),
    this.drawCricle(e.x, e.y + e.h, t),
    this.drawCricle(e.x + e.w, e.y + e.h, t),
    this.drawRect(e.x, e.y + e.h / 2, t),
    this.drawRect(e.x + e.w / 2, e.y, t),
    this.drawRect(e.x + e.w / 2, e.y + e.h, t),
    this.drawRect(e.x + e.w, e.y + e.h / 2, t)
  }

  _drawLine(e) {
    this.ctx.beginPath(),
    this.ctx.strokeStyle = e.color,
    this.ctx.lineWidth = 3,
    this.ctx.moveTo(e.x, e.y),
    this.ctx.lineTo(e.x1, e.y1),
    this.ctx.stroke()
  }

  _drawCurve(e) {
    this.ctx.beginPath(),
    this.ctx.moveTo(e.x, e.y),
    this.ctx.strokeStyle = e.color,
    this.ctx.lineWidth = 3,
    this.ctx.quadraticCurveTo(e.cx, e.cy, e.x1, e.y1),
    this.ctx.stroke()
  }

  isNearLine(e, t, a) { var r, i, c, n, o = e.x,
    s = e.x1,
    l = e.y,
    p = e.y1,
    h = 15;
    if (o !== s) {
      if (s > o && (o > t || t > s)) return !1;
      if (o > s && (s > t || t > o)) return !1;
      if (r = (l - p) / (o - s), i = l - r * o, c = r * t + i, Math.abs(c - a) < h) return !0;
      if (p > l && (l > a || a > p)) return !1;
      if (l > p && (p > a || a > l)) return !1;
      if (r = (o - s) / (l - p), i = o - r * l, n = r * a + i, Math.abs(n - t) < h) return !0
    } else if (o == s) {
      if (p > l && (l > a || a > p)) return !1;
      if (l > p && (p > a || a > l)) return !1;
      if (Math.abs(t - o) < h) return !0
    }
    return !1
  }

  showCoordinates(e) {
    var t = Math.floor(e.offsetX / this.curScale);
    var a = Math.floor(e.offsetY / this.curScale);
    $("#coordinates").children("p").html("X: " + t + " Y: " + a)
  }

  resizeImgCursor(e) {
    if ("setbackground" == this.operationType) {
      var t = e.offsetX / this.curScale;
      var a = e.offsetY / this.curScale;
      Math.abs(this.bginfo.x - t) < this.dr &&
      Math.abs(this.bginfo.y - a) < this.dr ||
      Math.abs(this.bginfo.x + this.bginfo.w - t) < this.dr &&
      Math.abs(this.bginfo.y + this.bginfo.h - a) < this.dr ? this.canvas.style.cursor = "nw-resize" :
      Math.abs(this.bginfo.x + this.bginfo.w - t) < this.dr &&
      Math.abs(this.bginfo.y - a) < this.dr ||
      Math.abs(this.bginfo.x - t) < this.dr &&
      Math.abs(this.bginfo.y + this.bginfo.h - a) < this.dr ? this.canvas.style.cursor = "ne-resize" :
      Math.abs(this.bginfo.x + this.bginfo.w / 2 - t) < this.dr &&
      Math.abs(this.bginfo.y - a) < this.dr ||
      Math.abs(this.bginfo.x + this.bginfo.w / 2 - t) < this.dr &&
      Math.abs(this.bginfo.y + this.bginfo.h - a) < this.dr ? this.canvas.style.cursor = "n-resize" :
      Math.abs(this.bginfo.x - t) < this.dr &&
      Math.abs(this.bginfo.y + this.bginfo.h / 2 - a) < this.dr ||
      Math.abs(this.bginfo.x + this.bginfo.w - t) < this.dr &&
      Math.abs(this.bginfo.y + this.bginfo.h / 2 - a) < this.dr ? this.canvas.style.cursor = "e-resize" :
      this.detectLeftButton(e) ||
      (this.canvas.style.cursor = "default")
    }
  }
  lineEventMove(e) {
    this.isDraw &&
    this.savePoint &&
    (this.ctx.putImageData(this.savePoint, 0, 0), this.draw({
      type: "line",
      x: this.startPoint.x,
      y: this.startPoint.y,
      x1: e.offsetX / this.curScale,
      y1: e.offsetY / this.curScale, color: this.lineColor
    }))
  }

curveEventMove(e) {
  this.isDraw &&
  this.savePoint &&
  (this.ctx.putImageData(this.savePoint, 0, 0),
  this.draw({
    type: "curve",
    x: this.curveinfo.x,
    y: this.curveinfo.y,
    x1: this.curveinfo.x1,
    y1: this.curveinfo.y1,
    cx: e.offsetX / this.curScale,
    cy: e.offsetY / this.curScale,
    color: this.lineColor
  }))
}

copyEventMove(e) {
  e || window.event;
  if (this.isDraw && this.savePoint && this.isSelectedGraph)
        if (this.ctx.putImageData(this.savePoint, 0, 0), "line" == this.isSelectedGraph.type) {
          var t = e.offsetX / this.curScale - (this.isSelectedGraph.x + this.isSelectedGraph.x1) / 2;
          var a = e.offsetY / this.curScale - (this.isSelectedGraph.y + this.isSelectedGraph.y1) / 2;
          this.isSelectedGraph.x += t,
          this.isSelectedGraph.y += a,
          this.isSelectedGraph.x1 += t,
          this.isSelectedGraph.y1 += a, this.draw(this.isSelectedGraph)
        } else if ("curve" == this.isSelectedGraph.type) {
          var t = e.offsetX / this.curScale - (this.isSelectedGraph.x + this.isSelectedGraph.x1) / 2;
          var a = e.offsetY / this.curScale - (this.isSelectedGraph.y + this.isSelectedGraph.y1) / 2;
          this.isSelectedGraph.x += t,
          this.isSelectedGraph.y += a,
          this.isSelectedGraph.x1 += t,
          this.isSelectedGraph.y1 += a,
          this.isSelectedGraph.cx += t,
          this.isSelectedGraph.cy += a,
          this.draw(this.isSelectedGraph)
        }
}

moveEventMove(e) {
  e || window.event;
  if (this.isDraw && this.savePoint && this.isSelectedGraph)
        if (this.ctx.putImageData(this.savePoint, 0, 0), "line" == this.isSelectedGraph.type) {
          var t = e.offsetX / this.curScale - (this.isSelectedGraph.x + this.isSelectedGraph.x1) / 2;
          var a = e.offsetY / this.curScale - (this.isSelectedGraph.y + this.isSelectedGraph.y1) / 2;
          this.isSelectedGraph.x += t,
          this.isSelectedGraph.y += a,
          this.isSelectedGraph.x1 += t,
          this.isSelectedGraph.y1 += a,
          this.draw(this.isSelectedGraph)
        } else if ("curve" == this.isSelectedGraph.type) {
          var t = e.offsetX / this.curScale - (this.isSelectedGraph.x + this.isSelectedGraph.x1) / 2;
          var a = e.offsetY / this.curScale - (this.isSelectedGraph.y + this.isSelectedGraph.y1) / 2;
          this.isSelectedGraph.x += t,
          this.isSelectedGraph.y += a,
          this.isSelectedGraph.x1 += t,
          this.isSelectedGraph.y1 += a,
          this.isSelectedGraph.cx += t,
          this.isSelectedGraph.cy += a,
          this.draw(this.isSelectedGraph)
        }
}

redrawMove(e) {
  this.isDraw &&
  this.savePoint &&
  (this.ctx.putImageData(
    this.savePoint, 0, 0),
    1 == this.redraw_index ? (
      this.graphs[this.gStep].x = e.offsetX / this.curScale, this.graphs[this.gStep].y = e.offsetY / this.curScale) :
    2 == this.redraw_index &&
    (this.graphs[this.gStep].x1 = e.offsetX / this.curScale, this.graphs[this.gStep].y1 = e.offsetY / this.curScale),
    this.draw(this.graphs[this.gStep]),
    this._selectCircle(this.graphs[this.gStep], 3)
  )
}

moveBackgroud(e) {
  if (this.isDraw && this.backGround && this.savePoint)
        if ("move" == this.bginfo.otype) {
          this.ctx.putImageData(this.savePoint, 0, 0);
          var t = e.offsetX / this.curScale - this.prevPos.x;
          var a = e.offsetY / this.curScale - this.prevPos.y;
          this.bginfo.x += t,
          this.bginfo.y += a,
          this.ctx.drawImage(this.backGround, this.bginfo.x, this.bginfo.y, this.bginfo.w, this.bginfo.h),
          this.prevPos.x = e.offsetX / this.curScale,
          this.prevPos.y = e.offsetY / this.curScale
        } else if ("resize" == this.bginfo.otype) {
          this.ctx.putImageData(this.savePoint, 0, 0);
          var t = e.offsetX / this.curScale - this.prevPos.x;
          var a = e.offsetY / this.curScale - this.prevPos.y;
          "TL" == this.bginfo.rtype ? (this.bginfo.x += t, this.bginfo.y += a, this.bginfo.w -= t, this.bginfo.h -= a) :
          "BR" == this.bginfo.rtype ? (this.bginfo.w += t, this.bginfo.h += a) :
          "BL" == this.bginfo.rtype ? (this.bginfo.x += t, this.bginfo.w -= t, this.bginfo.h += a) :
          "TR" == this.bginfo.rtype ? (this.bginfo.y += a, this.bginfo.w += t, this.bginfo.h -= a) :
          "LM" == this.bginfo.rtype ? (this.bginfo.x += t, this.bginfo.w -= t) :
          "RM" == this.bginfo.rtype ? this.bginfo.w += t :
          "TM" == this.bginfo.rtype ? (this.bginfo.y += a, this.bginfo.h -= a) :
          "BM" == this.bginfo.rtype && (this.bginfo.h += a),
          this.ctx.drawImage(this.backGround, this.bginfo.x, this.bginfo.y, this.bginfo.w, this.bginfo.h),
          this.drawSelectRect(this.bginfo, 3),
          this.prevPos.x = e.offsetX / this.curScale, this.prevPos.y = e.offsetY / this.curScale
        }
}

copyEventUp(e) {
  if (this.isDraw) {
    if (this.isSelectedGraph) {
      this.ctx.putImageData(this.savePoint, 0, 0);
      var t = this.getGridpos({
        x: this.isSelectedGraph.x,
        y: this.isSelectedGraph.y });
      var a = t.x - this.isSelectedGraph.x;
      var r = t.y - this.isSelectedGraph.y;
      "line" == this.isSelectedGraph.type ? (
        this.isSelectedGraph.x += a,
        this.isSelectedGraph.y += r,
        this.isSelectedGraph.x1 += a,
        this.isSelectedGraph.y1 += r) :
      "curve" == this.isSelectedGraph.type && (
        this.isSelectedGraph.x += a,
        this.isSelectedGraph.y += r,
        this.isSelectedGraph.x1 += a,
        this.isSelectedGraph.y1 += r,
        this.isSelectedGraph.cx += a,
        this.isSelectedGraph.cy += r),
        this.draw(this.isSelectedGraph),
        this.gPush(this.isSelectedGraph),
        this.hPush({ type: "copy" }),
        this.savePoint = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height),
        this._selectCircle(this.isSelectedGraph, 3)
      }
      this.isDraw = !1,
      this.isSelectedGraph = void 0, this.canvas.style.cursor = "pointer"
    }
  }

  moveEventUp(e) {
    if (this.isDraw) {
      if (this.isSelectedGraph) {
        this.ctx.putImageData(this.savePoint, 0, 0);
        var t = this.getGridpos({ x: this.isSelectedGraph.x, y: this.isSelectedGraph.y });
        var a = t.x - this.isSelectedGraph.x;
        var r = t.y - this.isSelectedGraph.y;
        "line" == this.isSelectedGraph.type ? (
          this.isSelectedGraph.x += a,
          this.isSelectedGraph.y += r,
          this.isSelectedGraph.x1 += a,
          this.isSelectedGraph.y1 += r) :
        "curve" == this.isSelectedGraph.type && (
          this.isSelectedGraph.x += a,
          this.isSelectedGraph.y += r,
          this.isSelectedGraph.x1 += a,
          this.isSelectedGraph.y1 += r,
          this.isSelectedGraph.cx += a,
          this.isSelectedGraph.cy += r),
          this.draw(this.isSelectedGraph),
          this.gPush(this.isSelectedGraph),
          this.hPush({
            type: "move",
            sindex: this.selectindex,
            sel: this.graphClone(this.isSelectedGraph2),
            rindex1: this.gStep,
            result1: this.graphClone(this.isSelectedGraph)
          }),
          this.savePoint = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height),
          this._selectCircle(this.isSelectedGraph, 3)
        }
        this.isDraw = !1,
        this.isSelectedGraph = void 0,
        this.canvas.style.cursor = "pointer"
      }
  }

lineEventUp(e) {
  if (this.isDraw && this.startPoint) {
    this.ctx.putImageData(this.savePoint, 0, 0);
    var t = this.getGridpos({ x: e.offsetX / this.curScale, y: e.offsetY / this.curScale });
    t.x != this.startPoint.x || t.y != this.startPoint.y ? (
      this._drawLine({
        x: this.startPoint.x,
        y: this.startPoint.y,
        x1: t.x,
        y1: t.y,
        color: this.lineColor
      }),
      this.gPush({
        type: "line",
        x: this.startPoint.x,
        y: this.startPoint.y,
        x1: t.x, y1: t.y,
        color: this.lineColor
      }),
      this.hPush({ type: "line" }),
      this.savePoint = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height),
      this._selectCircle({
        type: "line",
        x: this.startPoint.x, y:
        this.startPoint.y,
        x1: t.x,
        y1: t.y
      }, 3),
      this.setStartPointEmpty(), this.redraw_enable = !0) : this.redraw_enable = !1, this.isDraw = !1
    }
  }

  redrawUp(e) {
    if (this.isDraw) {
      this.ctx.putImageData(this.savePoint, 0, 0);
      var t = this.getGridpos({
        x: e.offsetX / this.curScale,
        y: e.offsetY / this.curScale });
        1 == this.redraw_index ? (this.graphs[this.gStep].x = t.x, this.graphs[this.gStep].y = t.y) :
        2 == this.redraw_index && (this.graphs[this.gStep].x1 = t.x, this.graphs[this.gStep].y1 = t.y), this.draw(this.graphs[this.gStep]),
        this.savePoint = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height),
        this._selectCircle(this.graphs[this.gStep], 3), this.operationType = this.histroys[this.hStep].type,
        this.canvas.style.cursor = "crosshair", this.isDraw = !1, this.redraw_index = 0
      }
  }

  curveEvenUp(e) {
    if (this.isDraw) {
      if (!this.makecurve && this.startPoint) {
        this.ctx.putImageData(this.savePoint, 0, 0);
        var t = this.getGridpos({ x: e.offsetX / this.curScale, y: e.offsetY / this.curScale });
        t.x == this.startPoint.x && t.y == this.startPoint.y ? (this.makecurve = !1, this.redraw_enable = !1) :
        (this.makecurve = !0, this.curveinfo = { x: this.startPoint.x, y: this.startPoint.y, x1: t.x, y1: t.y, cx:0, cy:0 },
          this._drawLine({ x: this.startPoint.x, y: this.startPoint.y, x1: t.x, y1: t.y, color: this.lineColor }),
          this._selectCircle({ type: "line", x: this.startPoint.x, y: this.startPoint.y, x1: t.x, y1: t.y }, 3))
      } else this.curveinfo.cx = e.offsetX / this.curScale, this.curveinfo.cy = e.offsetY / this.curScale, this.makecurve = !1,
        this.gPush({ type: "curve", x: this.curveinfo.x, y: this.curveinfo.y, x1: this.curveinfo.x1, y1: this.curveinfo.y1,
        cx: this.curveinfo.cx, cy: this.curveinfo.cy, color: this.lineColor }),
        this.hPush({ type: "curve" }), this.savePoint = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height),
        this._selectCircle({
          type: "curve",
          x: this.curveinfo.x,
          y: this.curveinfo.y,
          x1: this.curveinfo.x1,
          y1: this.curveinfo.y1,
          cx: this.curveinfo.cx,
          cy: this.curveinfo.cy }, 3),
          this.redraw_enable = !0;
        this.isDraw = !1, this.setStartPointEmpty()
      }
  }

  setStartPointEmpty() { this.startPoint = null }


  backGroundUp(e) {
    if (this.isDraw && this.backGround && this.savePoint && this.bginfo.otype) {
      var t = this.getGridpos({ x: this.bginfo.x, y: this.bginfo.y });
      this.bginfo.x = t.x, this.bginfo.y = t.y, t = this.getGridpos({ x: this.bginfo.w, y: this.bginfo.h }),
      this.bginfo.w = t.x, this.bginfo.h = t.y, this.reDrawAll(this.gStep, !0),
      this.savePoint = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height),
      this.drawSelectRect(this.bginfo, 3), this.canvas.style.cursor = "default"
    }
    this.isDraw = !1, this.bginfo.otype = void 0, this.bginfo.rtype = void 0
  }

  breakerEventUp(e) {
    if (this.isDraw && this.isSelectedGraph && "line" == this.isSelectedGraph.type) {
      var t, a, r, i, c, n, o = this.isSelectedGraph.x,
      s = this.isSelectedGraph.y,
      l = this.isSelectedGraph.x1,
      p = this.isSelectedGraph.y1,
      h = e.offsetX / this.curScale,
      d = e.offsetY / this.curScale;
      if (Math.abs(o - l) > Math.abs(s - p)) {
        if (l > o && (o > h || h > l)) return !1;
        if (o > l && (l > h || h > o)) return !1;
            t = (s - p) / (o - l), a = s - t * o, l > o ? (r = t * (h - 2) + a, i = t * (h + 2) + a,
            this.gPush({ type: "line", x: o, x1: h - 2, y: s, y1: r, color: this.isSelectedGraph.color }),
            this.gPush({ type: "line", x: l, y: p, x1: h + 2, y1: i, color: this.isSelectedGraph.color }),
            this.hPush({ type: "breaker", sindex: this.selectindex, sel: this.graphClone(this.isSelectedGraph),
            rindex1: this.gStep - 1, result1: {type: "line", x: o, x1: h - 2, y: s, y1: r, color: this.isSelectedGraph.color },
            rindex2: this.gStep, result2: { type: "line", x: l, y: p, x1: h + 2, y1: i, color: this.isSelectedGraph.color }
          })) : (i = t * (h - 2) + a, r = t * (h + 2) + a, this.gPush({ type: "line", x: l, y: p, x1: h - 2, y1: i, color: this.isSelectedGraph.color }),
          this.gPush({ type: "line", x: o, y: s, x1: h + 2, y1: r, color: this.isSelectedGraph.color }),
          this.hPush({ type: "breaker", sindex: this.selectindex, sel: this.graphClone(this.isSelectedGraph), rindex1: this.gStep - 1,
          result1: { type: "line", x: l, y: p, x1: h - 2, y1: i, color: this.isSelectedGraph.color }, rindex2: this.gStep,
          result2: { type: "line", x: o, y: s, x1: h + 2, y1: r, color: this.isSelectedGraph.color } }))
        } else {
          if (p > s) {
            if (s > d || d > p) return !1
          } else if (p > d || d > s) return !1;
          t = (o - l) / (s - p), a = o - t * s, p > s ? (c = t * (d - 2) + a, n = t * (d + 2) + a,
          this.gPush({ type: "line", x: o, y: s, x1: c, y1: d - 2, color: this.isSelectedGraph.color }),
          this.gPush({ type: "line", x: l, y: p, x1: n, y1: d + 2, color: this.isSelectedGraph.color }),
          this.hPush({ type: "breaker", sindex: this.selectindex, sel: this.graphClone(this.isSelectedGraph), rindex1: this.gStep - 1,
          result1: { type: "line", x: o, y: s, x1: c, y1: d - 2, color: this.isSelectedGraph.color }, rindex2: this.gStep,
          result2: { type: "line", x: l, y: p, x1: n, y1: d + 2, color: this.isSelectedGraph.color } })) :
          (c = t * (d + 2) + a, n = t * (d - 2) + a,
          this.gPush({ type: "line", x: l, y: p, x1: n, y1: d - 2, color: this.isSelectedGraph.color }),
          this.gPush({ type: "line", x: o, y: s, x1: c, y1: d + 2, color: this.isSelectedGraph.color }),
          this.hPush({ type: "breaker", sindex: this.selectindex, sel:
          this.graphClone(this.isSelectedGraph), rindex1: this.gStep - 1,
          result1: { type: "line", x: l, y: p, x1: n, y1: d - 2, color: this.isSelectedGraph.color }, rindex2: this.gStep,
          result2: { type: "line", x: o, y: s, x1: c, y1: d + 2, color: this.isSelectedGraph.color } }))
        }
        this.reDrawAll(this.gStep, 1), this.savePoint = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height),
        this._selectCircle(this.graphs[this.gStep - 1], 3), this._selectCircle(this.graphs[this.gStep], 3)
      }
      this.isDraw = !1, this.isSelectedGraph = void 0
    }

  deleteEventUp(e) {
    this.isDraw && this.isSelectedGraph && (this.reDrawAll(this.gStep, 1), this.isDraw = !1,
    this.hPush({ type: "delete", sindex: this.selectindex, sel: this.graphClone(this.isSelectedGraph) }),
    this.isSelectedGraph = void 0, this.savePoint = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height))
  }

  disableIcon() {
    0 > this.hStep ? $(".undo").css("background-color", "lightgray") : $(".undo").css("background-color", "white"),
    this.hStep >= this.histroys.length - 1 ? $(".redo").css("background-color", "lightgray") : $(".redo").css("background-color", "white"),
    0 > this.gStep ? ($(".export").css("background-color", "lightgray"), $(".copy").css("background-color", "lightgray"), $(".move").css("background-color", "lightgray"), $(".breaker").css("background-color", "lightgray"), $(".delete").css("background-color", "lightgray")) : ($(".copy").css("background-color", "white"), $(".move").css("background-color", "white"), $(".breaker").css("background-color", "white"), $(".delete").css("background-color", "white"))
  }

  gPush(e) { this.gStep++, this.gStep < this.graphs.length && (this.graphs.length = this.gStep), this.graphs.push(e) }
  hPush(e) { this.hStep++, this.hStep < this.histroys.length && (this.histroys.length = this.hStep), this.histroys.push(e) }

  zoomin(e) { this.ctx.setTransform(1, 0, 0, 1, 0, 0), this.curScale += e, this.zoomCanvasSize(), this.ctx.scale(this.curScale, this.curScale);
    console.log(this.curScale), this.reDrawAll(this.gStep, 1), this.savePoint = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height) }

  zoomout(e) {
    if (1 >= this.curScale)
      return this.ctx.setTransform(1, 0, 0, 1, 0, 0),
              this.curScale = 1, this.ctx.scale(1, 1), this.reDrawAll(this.gStep,1 ),
              void(this.savePoint = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height));
    this.ctx.setTransform(1, 0, 0, 1, 0, 0), this.curScale -= e, this.zoomCanvasSize(), this.ctx.scale(this.curScale, this.curScale);
    console.log(this.curScale), this.reDrawAll(this.gStep, 1), this.savePoint = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
  }

  zoomCanvasSize() {
    this.width = this.initW * this.curScale, this.height = this.initH * this.curScale,
    $("#mycanvas").width(this.width), $("#mycanvas").height(this.height), this.ctx.canvas.width = this.width, this.ctx.canvas.height = this.height
  }

  menu(e, t) {
    $("#menu").css("top", t + "px");
    $("#menu").css("left", e + "px");
    $("#menu").css("visibility", "visible");
    $("#menu").css("opacity", "1");
    $("#menu").show();
  }

  hUndo() {
    if (this.hStep >= 0) {
      var e =this. histroys[this.hStep];
      switch (this.hStep--, e.type) {
      case "line":
      case "curve":
      case "copy":
        this.gUndo();
        break;
      case "delete":
        this.graphs.splice(e.sindex, 0, e.sel);
        this.gStep++;
        this.reDrawAll(this.gStep, 1);
        break;
      case "move":
        this.graphs.splice(this.gStep, 1);
        this.graphs.splice(e.sindex, 0, e.sel);
        this.reDrawAll(this.gStep, 1);
        break;
      case "breaker":
        this.graphs.splice(this.gStep - 1, 2);
        this.graphs.splice(e.sindex, 0, e.sel),
        this.gStep--;
        this.reDrawAll(this.gStep, 1);
        break;
      case "disable":
        this.graphs.splice(this.gStep, 1);
        this.graphs.splice(e.sindex, 0, e.sel);
        this.reDrawAll(this.gStep, 1);
        break;
      case "normal":
        this.graphs.splice(this.gStep, 1);
        this.graphs.splice(e.sindex, 0, e.sel),
        this.reDrawAll(this.gStep, 1)
      }
      this.savePoint = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height), this.gStep >= 0 && this._selectCircle(this.graphs[this.gStep], 3)
      }
    }

hRedo() {
  if (this.hStep >= -1 && this.histroys.length > this.hStep + 1) {
    this.hStep++; var e = this.histroys[this.hStep];
    if (!e.type) return;
    switch (e.type) {
      case "line":
      case "curve":
      case "copy":
          this.gRedo(); break;
      case "delete":
          this.graphs.splice(e.sindex, 1), this.gStep--, this.reDrawAll(this.gStep, 1); break;
      case "move":
          this.graphs.splice(e.sindex, 1), this.graphs.splice(e.rindex1, 0, e.result1), this.reDrawAll(this.gStep, 1); break;
      case "breaker":
          this.graphs.splice(e.sindex, 1), this.graphs.splice(e.rindex1, 0, e.result1, e.result2), this.gStep++, this.reDrawAll(this.gStep, 1); break;
      case "disable":
          this.graphs.splice(e.sindex, 1), this.graphs.splice(e.rindex1, 0, e.result1), this.reDrawAll(this.gStep, 1); break;
      case "normal":
          this.graphs.splice(e.sindex, 1), this.graphs.splice(e.rindex1, 0, e.result1), this.reDrawAll(this.gStep, 1) }
          this.savePoint = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height), this._selectCircle(this.graphs[this.gStep], 3)
    }
  }

  gUndo() {
    this.gStep >= 0 && (this.gStep--, this.reDrawAll(this.gStep, 1), this.savePoint = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height))
  }

  gRedo() {
    this.gStep < this.graphs.length - 1 && (this.gStep++, this.reDrawAll(this.gStep, 1),
    this.savePoint = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height))
  }

  gridClick(){
    this.gridon = !this.gridon;
    this.reDrawAll(this.gStep, 1);
  }

  zoominClick(){
    this.zoomin(.1);
  }
  zoomoutClick(){
    this.zoomout(.1);
  }

  setBackgroundClick(){
    $("#background").click();
  }

  exportClick() {
    var e;
    if (this.graphs.length > 0) {
        e = JSON.stringify(this.graphs.slice(0, this.gStep + 1));
        var t = new Blob([e], { type: "application/json" });
        var a = document.createElement("a");
        a.href = URL.createObjectURL(t);
        a.download = "data.json";
        document.body.appendChild(a), a.click(), document.body.removeChild(a)
    }
  }

  importClick() {
      $("#load").click();
  }

  rBreaker() {
    this.isSelectedGraph = this.graphs.splice(this.contextinfo.index, 1)[0];
    this.gStep--;
    this.MakeBreaker(this.contextinfo.index, this.contextinfo.x, this.contextinfo.y);
    this.contextmenu = !1;
    this.contextinfo = null
  }

  rDisable() {
    this.isSelectedGraph = this.graphs.splice(this.contextinfo.index, 1)[0];
    this.gStep--;
    this.MakeDisable();
    this.contextmenu = !1;
    this.contextinfo = null;
  }

  rNormal() {
    this.isSelectedGraph = this.graphs.splice(this.contextinfo.index, 1)[0];
    this.gStep--;
    this.MakeNormal();
    this.contextmenu = !1;
    this.contextinfo = null;
  }

  rDelete() {
    this.isSelectedGraph = this.graphs.splice(this.contextinfo.index, 1)[0];
    this.gStep--;
    this.SelectDelete();
    this.contextmenu = !1;
    this.contextinfo = null;
  }

  rCopy() {
    this.clipbord = this.graphClone(this.graphs[this.contextinfo.index]);
    this.contextmenu = !1
    this.contextinfo = null;
  }

  rPaste() {
    if (this.isDraw) {
      var e = this.getGridpos({ x: this.contextinfo.x, y: this.contextinfo.y });
    }
  }

  MakeBreaker(e, t, a) {
    if (this.isDraw && this.isSelectedGraph && "line" == this.isSelectedGraph.type) {
      var r, i, c, n, o, s, l = this.isSelectedGraph.x,
      p = this.isSelectedGraph.y,
      h = this.isSelectedGraph.x1,
      d = this.isSelectedGraph.y1;
      if (Math.abs(l - h) > Math.abs(p - d)) {
        if (h > l && (l > t || t > h)) return !1;
        if (l > h && (h > t || t > l)) return !1;
        r = (p - d) / (l - h), i = p - r * l, h > l ? (c = r * (t - 2) + i, n = r * (t + 2) + i,
        this.gPush({ type: "line", x: l, x1: t - 2, y: p, y1: c, color: this.isSelectedGraph.color }),
        this.gPush({ type: "line", x: h, y: d, x1: t + 2, y1: n, color: this.isSelectedGraph.color }),
        this.hPush({ type: "breaker", sindex: e, sel: this.graphClone(this.isSelectedGraph), rindex1: this.gStep - 1, result1: {
          type: "line", x: l, x1: t - 2, y: p, y1: c, color: this.isSelectedGraph.color }, rindex2: this.gStep, result2: {
          type: "line", x: h, y: d, x1: t + 2, y1: n, color: this.isSelectedGraph.color } })) : (n = r * (t - 2) + i, c = r * (t + 2) + i,
        this.gPush({ type: "line", x: h, y: d, x1: t - 2, y1: n, color: this.isSelectedGraph.color }),
        this.gPush({ type: "line", x: l, y: p, x1: t + 2, y1: c, color: this.isSelectedGraph.color }),
        this.hPush({ type: "breaker", sindex: e, sel: this.graphClone(this.isSelectedGraph), rindex1: this.gStep - 1, result1: {
          type: "line", x: h, y: d, x1: t - 2, y1: n, color: this.isSelectedGraph.color }, rindex2: this.gStep, result2: {
          type: "line", x: l, y: p, x1: t + 2, y1: c, color: this.isSelectedGraph.color } }))
      } else {
        if (d > p) {
          if (p > a || a > d) return !1
        } else if (d > a || a > p) return !1;
        r = (l - h) / (p - d), i = l - r * p, d > p ? (o = r * (a - 2) + i, s = r * (a + 2) + i,
        this.gPush({ type: "line", x: l, y: p, x1: o, y1: a - 2, color: this.isSelectedGraph.color }),
        this.gPush({ type: "line", x: h, y: d, x1: s, y1: a + 2, color: this.isSelectedGraph.color }),
        this.hPush({ type: "breaker", sindex: e, sel: this.graphClone(this.isSelectedGraph), rindex1: this.gStep - 1, result1: {
          type: "line", x: l, y: p, x1: o, y1: a - 2, color: this.isSelectedGraph.color }, rindex2: this.gStep, result2: {
          type: "line", x: h, y: d, x1: s, y1: a + 2, color: this.isSelectedGraph.color } })) : (o = r * (a + 2) + i, s = r * (a - 2) + i,
        this.gPush({ type: "line", x: h, y: d, x1: s, y1: a - 2, color: this.isSelectedGraph.color }),
        this.gPush({ type: "line", x: l, y: p, x1: o, y1: a + 2, color: this.isSelectedGraph.color }),
        this.hPush({ type: "breaker", sindex: e, sel: this.graphClone(this.isSelectedGraph), rindex1: this.gStep - 1, result1: {
          type: "line", x: h, y: d, x1: s, y1: a - 2, color: this.isSelectedGraph.color }, rindex2: this.gStep, result2: {
          type: "line", x: l, y: p, x1: o, y1: a + 2, color: this.isSelectedGraph.color } }))
      }
      this.reDrawAll(this.gStep, 1),
      this.savePoint = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height),
      this._selectCircle(this.graphs[this.gStep - 1], 3), this._selectCircle(this.graphs[this.gStep], 3)
    }
    this.isDraw = !1,
    this.isSelectedGraph = void 0
  }

  MakeDisable() {
    if (this.isDraw && this.isSelectedGraph) {
      var e = this.graphClone(this.isSelectedGraph);
      this.isSelectedGraph.color = "#0000ff",
      this.gPush(this.isSelectedGraph),
      this.hPush({ type: "disable", sindex: this.contextinfo.index, sel: e, rindex1: this.gStep,
      result1: this.graphClone(this.isSelectedGraph) }), this.reDrawAll(this.gStep, 1),
      this.savePoint = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height),
      this._selectCircle(this.graphs[this.gStep], 3)
    }
    this.isDraw = !1,
    this.isSelectedGraph = void 0
  }

  MakeNormal() {
    if (this.isDraw && this.isSelectedGraph) {
      var e = this.graphClone(this.isSelectedGraph);
      this.isSelectedGraph.color = "#000000",
      this.gPush(this.isSelectedGraph),
      this.hPush({ type: "normal", sindex: this.contextinfo.index, sel: e, rindex1: this.gStep,
      result1: this.graphClone(this.isSelectedGraph) }), this.reDrawAll(this.gStep, 1),
      this.savePoint = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height),
      this._selectCircle(this.graphs[this.gStep], 3)
    }
    this.isDraw = !1,
    this.isSelectedGraph = void 0
  }

  SelectDelete() {
    this.isDraw && this.isSelectedGraph && (this.hPush({ type: "delete", sindex: this.contextinfo.index,
    sel: this.graphClone(this.isSelectedGraph) }), this.reDrawAll(this.gStep, 1),
    this.savePoint = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)),
    this.isDraw = !1,
    this.isSelectedGraph = void 0
  }

  RouteSelected(floor_id){
    var self = this;

    $('.active-picker').removeClass('active-picker');
    $('.hand-box').addClass('active-picker');
    for (let i = 0; i < this.floors.length; i++){
      if (this.floors[i].short_name == floor_id){
        $("#image").hide();
        this.MapType = this.basePath + '/' + this.floors[i].map[0];
        $('.first-color').css('background-color',this.floors[i].color1);
        $('.second-color').css('background-color',this.floors[i].color2);
        if (!$.isEmptyObject($("body div.viewport").get(0))){
          $("#image").imgNotes("destroy");
        }


        setTimeout(function(){

          self.plotMap();
        },1000);
      }
    }

    /* this.MapType = this.locations[index].map;
    $scope.latitude=$scope.AllLocation[index].latitude;
    $scope.longitude=$scope.AllLocation[index].longitude;
    if($scope.previous == undefined){
        $scope.previous= '';
    }
    if($scope.current == undefined){
        $scope.current = index;
        $(".loader").fadeIn("slow");
        plotMap();
    }else  {
        $(".loader").fadeIn("slow");
        plotMap();
    } */
  }
  viewResized(){
    $("#image").show();
    var vHeight = $("#view").height();
    var vWidth = $("#view").width();
    var height = $('#image').height();
    var width = $('#image').width();
    if (height* width == 0 || vHeight * vWidth == 0)
      return;

    $('#image').css("width","100%");
    console.log($('#image').height() + 60);
    $('#rsidebar').css('height', $('#image').height() + 60 + 'px');
    // if (vHeight < height  || vWidth < width){
    //   if (vHeight / vWidth > height / width){
    //
    //     $('#image').css("width","100%");
    //     $('#image').css("height","");
    //    // $('#image').height(height * vWidth / width);
    //   }else{
    //     $('#image').css("height","100%");
    //     $('#image').css("width","");
    //     //$('#image').height(width * vHeight / height);
    //   }
    // }

  }
  plotMap(){
    let self = this;
    var notes = [];
    this.locations = [];
    this.getViewFacilities();
    this.getViewDestinations();
    this.getViewEmergencies();
    this.getViewPois();
    this.getViewBeacons();
    this.getViewPlayers();

    for (var i = 0 ; i < this.locations.length ; i++){
      notes[i] = {x : this.locations[i].x, y: this.locations[i].y, note: this.locations[i].LocationType, id: this.locations[i].id};
    }

    //$('#image').load(function(){
      this.viewResized();
      var $img = $("#image").imgNotes({});
      this.canvasImg = $img;
      $img.imgNotes("import", notes);
      $img.imgNotes("option","canEdit", false);
      $("div.viewport").css('cursor','pointer');
      html2canvas($("div.viewport").get(0),{useCORS : true, logging: false}).then(function(canvas){
        self.ctx = canvas.getContext('2d');
      });
      $("body div.viewport").bind('click', function(e){
        var rect = this.getBoundingClientRect();
        var x = e.clientX - rect.left; //x position within the element.
        var y = e.clientY - rect.top;  //y position within the element.
        var p = self.ctx.getImageData(x, y, 1, 1).data;
        var hex = "#" + ("000000" + self.rgbToHex(p[0], p[1], p[2])).slice(-6);
        if (!$('.active-picker').hasClass('hand-box'))
          $('div.active-picker span.color-box').css('background-color',hex);
          self.customerService.savedFlag = false;
      });
 //});
  }
rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}
  HideplotMap(){
    $('#imageappend').hide();
  }

  takeScreenShot() {
    let self = this;
    html2canvas(document.getElementById("image"),{useCORS : true, logging: false}).then(function(canvas){
        let myImg = document.querySelector("#image");
        let realWidth: number = myImg['naturalWidth'];
        let realHeight: number = myImg['naturalHeight'];
        let tempcanvas=document.createElement('canvas');
        let context=tempcanvas.getContext('2d');
        tempcanvas.width=realWidth;
        tempcanvas.height=realHeight;
        context.drawImage(canvas, 0, 0, realWidth, realHeight);
        let pData = context.getImageData(0,0,realWidth, realHeight).data;
        let result = [];
        let walkable = $('.first-color').css('background-color').replace(/\D+/g, '');
        let diswalkable = $('.second-color').css('background-color').replace(/\D+/g, '');
        for (let j: number = 0 ; j < realHeight; j++){
          let row = [];
          for (let i: number = 0 ; i < realWidth; i++){
            let color = "" + pData[i*4 + j *realWidth] + pData[i*4 + j *realWidth + 1] + pData[i*4 + j *realWidth + 2];
            if (color == walkable ){
              result.push({x: i, y: j, w: 1,d: 0});
            }else if (color == diswalkable){
              result.push({x: i, y: j, w: 0, d: 1});
            }
            else{
              result.push({x: i, y: j, w: 0, d: 0});
            }
          }
          //result.push(row);
        }
        console.log(result);

        self.aynarouteData.floor_id = self.selectedFloor;
        self.aynarouteData.pixel_map = JSON.stringify(result);

        // $.ajax({
        //     url: '/api/aynaroute/',
        //     type: 'POST',
        //     data: self.aynarouteData,
        //     success: function(result) {
        //         alert('the request was successfully sent to the server');
        //     }
        // });
        // let headers = new Headers({ 'Content-Type': 'application/json', 'method' : 'POST' });
         // let options = new RequestOptions({ headers: headers });
          // self.http.post('/api/aynaroute/', self.aynarouteData)
          //      .map(response=> { console.log("Ok")});

       //  self.customerService.createAynaRoute(self.aynarouteData).then(res => {
       //    console.log("create aynaroute success");
       //  },err => {
       //    console.log("create aynaroute failed");
       // });
         let file = new File([JSON.stringify(result)],'pixmap.json',{ type: 'application/json' });
         var loopPromises = [];
         var promise = self.customerService.uploadFloorFile(file);
         loopPromises.push(promise);

         Promise.all(loopPromises)
          .then(values => {
            var arr = values.map(function (elm) {
                return elm._body;
            });
            self.saveFloorData();
            console.log(arr);
          }, err => {
            $('.waiting-modal').css('display','none');

          });

        // saveAs(file, 'Pixmap_'+ self.selectedFloor + '.json');
        //var filepath = 'C:/'+ self.selectedFloor + '.json';
        //var file = new File(['foo'],filepath,{type: 'text/plain'});

    //   var txtFile = "c:/test.txt";
    //   var file = new File([""],txtFile);
    //   var str = "My string of text";
    //   file.open("w"); // open file with write access
    //   file.writeln("First line of text");
    //   file.writeln("Second line of text " + str);
    //   file.write(str);
    //   file.close();
    // /*  var link=document.createElement("a");
    //     link.href=tempcanvas.toDataURL('image/jpg');   //function blocks CORS
    //     link.download = 'screenshot.jpg';
    //     link.click();*/
        //$('#rightcontainer').css

        // document.getElementById("mycanvas").style.backgroundImage = "url('" + self.MapType + "')";
        // document.getElementById("mycanvas")['src'] = string;
        //$('#imageappend').hide();
        //$("#image").imgNotes("destroy");
        //$(".loader").fadeOut("slow");

    });
  }
  saveFloorData(){
     let self = this;

     for (var i = 0; i < this.floors.length; i++){
      if (this.floors[i].short_name == this.selectedFloor){
        this.floors[i].color1 = $('.first-color').css('background-color');
        this.floors[i].color2 = $('.second-color').css('background-color');
        this.customerService.editFloor(this.floors[i]).then(
            res => {
              console.log(this.floors[i]);
              self.customerService.savedFlag = true;
               $('.waiting-modal').css('display','none');
            },
            err => {
               $('.waiting-modal').css('display','none');
              console.log(err);
          }
        )
      }
    }
  }
  saveButtonClick(){
    let self = this;
    $('.waiting-modal').css('display','block');
    //this.takeScreenShot();

    this.saveFloorData();
  }
}
