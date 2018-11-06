import { Component, OnInit } from '@angular/core';
import { LocationService } from '../../../../components/auth/location.service';
import { AuthService } from '../../../../components/auth/auth.service';
import { CustomerService } from '../../../../components/auth/customer.service';
import { LanguageService } from '../../../../components/auth/language.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';


declare var jquery: any;
declare var Dropzone: any;
declare var $: any;

@Component({
  selector: 'app-edit-beacons',
  templateUrl: './edit-beacons.component.html',
  styleUrls: ['../../customer.item.edit.css']
})
export class EditBeaconsComponent implements OnInit {

  basePath = environment.basePath;  
  beaconData = {
    beacon_code: '',
    uid: '',    
    building_id: '',
    floor_id: '',
    type: '',
    brand: '',
    mac: '',
    latitude: 0.0,
    longitude: 0.0,
    tags: [],
    status: true
  }
    
  BeaconType = [{ name: 'Location' }, { name: 'Information' }];

  public editorConfig = {
    theme: 'snow',
    placeholder: '',
    modules: {
      
    }
  }
  
  currentUser = {};
  currentLanguage = '';
  currentName = '';
  floors = [];
  MapType = '';

  locationService: LocationService;
  authService: AuthService;
  customerService: CustomerService;
  toastrService: ToastrService;
  languageService: LanguageService;
  Router: any;
  route: ActivatedRoute;
  id: '';
  isAdd = true; 
  
  constructor(private _locationService: LocationService,
              private _authService: AuthService,
              private _customerService: CustomerService,
              private _toastrService: ToastrService,
              private _languageService: LanguageService,
              private router: Router,
            private _route: ActivatedRoute) {
    this.locationService = _locationService;
    this.authService = _authService;
    this.customerService = _customerService;
    this.toastrService = _toastrService;
    this.languageService = _languageService;
    this.Router = router;
    this.route = _route;
    if (this.route.snapshot.params['beacon_id'] == ''){
      this.beaconData.building_id = this.route.snapshot.params['building_id'];
      console.log("building_id===========" + this.beaconData.building_id);
      this.beaconData.floor_id = this.route.snapshot.params['floor_id'];
      console.log("floor_id===========" + this.beaconData.floor_id);  
    } else {
      this.id = this.route.snapshot.params['beacon_id'];
      this.isAdd = false;
    }  
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
      self.currentUser = user;
      if (!self.isAdd){
        self.getBeacon(this.id);
      } else {
        self.getFloors();
      }
      console.log(self.currentUser);                    
    });
  }
  
  getBeacon(id) {
    let self = this;
    this.customerService.getBeaconbyId(id)
    .then(res=> {
      self.beaconData = res.json();
      self.getFloors();      
      console.log("beacon================" + self.beaconData);
    })
  }
  
  getFloors(){
    let self = this;
    this.customerService.getFloors().then(
    res => {                
        self.floors = res.json();
        self.ToggleMap();
        console.log(self.floors)
    },
    err => {        
        self.toastrService.error('Failed to get floor list.', 'Error!!', {"positionClass": "toast-bottom-right"});
    }
    )
  }

  initaiteMap(){
    let self  = this;
    $(document).ready(() => {
        setTimeout(() => {
               var notes = [{x: self.beaconData.latitude, y:self.beaconData.longitude, note:"beacon"}];
               /* $(window).load(() => { */
                   var $img = $("#image").imgNotes({
                       onEdit: function(ev, elem) {
                           var $elem = $(elem);                            
                       }
                   });                 
                   $img.imgNotes("import", notes);
                   $img.imgNotes("option","canEdit", true);
                   $("#image-map").css("top", "0");
                   $("#image-map").css("left", "15px");
               /* }); */
        }, 1)
   });
  }
  
  ToggleMap(){
    for (let i = 0; i < this.floors.length; i++){
        if (this.beaconData.floor_id == this.floors[i].short_name ){
            this.MapType = this.basePath + '/' + this.floors[i].map[0];
        }
    }
    //this.initaiteMap();
  }
  
  save(){
    let self  = this;
    console.log(this.beaconData);
    if (!self.isAdd){
      this.customerService.editBeacon(this.beaconData).then(
        res => {                
          self.Router.navigate(['/customer/home', { outlets: { popup: ['beacons'] } }]);
        },
        err => {
          console.log(err);
          if (err._body != undefined && err._body != null) {
            self.toastrService.error(err._body, 'Error!!', {"positionClass": "toast-bottom-right"});
          } else {
            self.toastrService.error("Failed to create Beacon.", 'Error!!', {"positionClass": "toast-bottom-right"});
          }
        }
      )
    } else {
      this.customerService.createBeacon(this.beaconData).then(
        res => {                
          self.Router.navigate(['/customer/home', { outlets: { popup: ['beacons'] } }]);
        },
        err => {
          console.log(err);
          if (err._body != undefined && err._body != null) {
            self.toastrService.error(err._body, 'Error!!', {"positionClass": "toast-bottom-right"});
          } else {
            self.toastrService.error("Failed to save Beacon.", 'Error!!', {"positionClass": "toast-bottom-right"});
          }
        }
      )
    }
  }  
}