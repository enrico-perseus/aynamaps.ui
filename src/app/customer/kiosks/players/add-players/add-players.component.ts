import { Component, OnInit } from '@angular/core';
import { LocationService } from '../../../../../components/auth/location.service';
import { AuthService } from '../../../../../components/auth/auth.service';
import { CustomerService } from '../../../../../components/auth/customer.service';
import { LanguageService } from '../../../../../components/auth/language.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';


declare var jquery: any;
declare var Dropzone: any;
declare var $: any;

@Component({
    selector: 'app-addplayers',
    templateUrl: './add-players.component.html',
    styleUrls: ['./add-players.component.css']
})
export class AddPlayersComponent implements OnInit {
    
    basePath = environment.basePath;
    playerData = {
        uid: '',    
        building_id: '',
        floor_id: '',
        playerip: '',
        player_code: '',
        player_number: '',
        group_id: '',
        type: '',    
        map_rotate: '',    
        orientation: '',
        assistant: true,
        tags: [],
        player_name: [],
        latitude: 0.0,
        longitude: 0.0,
        status: true
      };

    TypeList = [
        { name: 'Indoor' }, 
        { name: 'Outdoor' }
    ];

    PlayerNameList = [];
    
    
    public editorConfig = {
        theme: 'snow',
        placeholder: '',
        modules: {
          
        }
    }

    MapRotation = [{ name: 'East' }, { name: 'West' }, { name: 'North' }, { name: 'South' }];
    ScreenOrientation = [{ name: 'Landscape' }, { name: 'Portrait' }];
    MapType = '';

        currentUser = {};
        currentLanguage = '';
        currentName = '';
        
        buildings = [];
        floors = [];
        
        groups = [];
        
        locationService: LocationService;
        authService: AuthService;
        customerService: CustomerService;
        toastrService: ToastrService;
        languageService: LanguageService;
        Router: any;
        route: ActivatedRoute;
    
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
        
        this.playerData.building_id = this.route.snapshot.params['building_id'];
        console.log("building_id===========" + this.playerData.building_id);
        this.playerData.floor_id = this.route.snapshot.params['floor_id'];
        console.log("floor_id===========" + this.playerData.floor_id);  
    }
    
    ngOnInit() {
        this.reset();
        let self = this;
        this.authService.currentUserChanged.subscribe(user => {
            self.currentUser = user;
            self.reset();
        });

        this.customerService.getIpAddress().subscribe(data => {
            self.playerData.playerip = data.ip;
        })
    }
    
    reset() {
        let self = this;
        this.authService.getCurrentUser().then(user => {      
            self.currentUser = user;
            self.getFloors();
            self.getGroups();
            //self.ToggleMap(); 
            console.log(self.currentUser);
        });
    }
    
    getGroups() {
        let self = this;
        this.locationService.getGroup().toPromise()
        .then(
            groups => {                                
                self.groups = groups;
            },
            err => {
                console.log(err);        
            }
        )
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

    AppendNameValue(){
        let k = this.PlayerNameList.length;
        this.PlayerNameList.push({
            id: k,
            name: '',
            value: ''
        });
    }

    RemoveNameValue(index){
        //alert(index);
        this.PlayerNameList.splice(index, 1);        
    }
    
    ToggleMap(){
        for (let i = 0; i < this.floors.length; i++){
            if (this.playerData.floor_id == this.floors[i].short_name ){
                this.MapType = this.basePath + '/' + this.floors[i].map[0];
            }
        }
        //this.initaiteMap();
    }
    
    initaiteMap(){
        let self  = this;
        $(document).ready(() => {
            setTimeout(() => {
                   var notes = [{x: self.playerData.latitude, y:self.playerData.longitude, note:"player"}];
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
    
    save(){
        let self = this;
        console.log(this.playerData);
        $("#tableNameValue>tbody>tr").each(function (index, value) {
            if ($(value).data('id') == undefined || $(value).data('id') == null) {
                self.PlayerNameList[index] = {};
                self.PlayerNameList[index].id = 0;
                self.PlayerNameList[index].name = $(value).find('td').eq(0).text();
                self.PlayerNameList[index].value = $(value).find('td').eq(1).text();
            } else {
                self.PlayerNameList[index] = {};
                self.PlayerNameList[index].id = $(value).data('id');
                self.PlayerNameList[index].name = $(value).find('td').eq(0).text();
                self.PlayerNameList[index].value = $(value).find('td').eq(1).text();
            }
        });
        this.playerData.player_name = this.PlayerNameList;
        if (this.playerData.latitude > 0 && this.playerData.longitude > 0) {
            this.locationService.addPlayer(this.playerData).then(
                res => {                
                    self.Router.navigate(['/customer/home', { outlets: { popup: ['players'] } }]);
                    },
                err => {
                    console.log(err);
                    if (err._body != undefined && err._body != null) {
                        self.toastrService.error(err._body, 'Error!!', {"positionClass": "toast-bottom-right"});
                    } else {
                        self.toastrService.error("Failed to create Player.", 'Error!!', {"positionClass": "toast-bottom-right"});
                    }
                }
            )
        } else {
            this.toastrService.error("The Player map position is required", 'Error!!', {"positionClass": "toast-bottom-right"});
        }
    }
}