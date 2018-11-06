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
    selector: 'app-editplayers',
    templateUrl: './edit-players.component.html',
    styleUrls: ['./edit-players.component.css']
})
export class EditPlayersComponent implements OnInit {

    basePath = environment.basePath;
    playerData = {
        _id: '',
        uid: '',    
        building_id: '',
        floor_id: '',
        playerip: '',
        player_code: '',
        player_number: '',
        player_name: [],
        group_id: '',
        type: '',    
        map_rotate: '',    
        orientation: '',
        assistant: true,
        tags: [],
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
    route: any;
    id: ''; 
  
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
        this.id = this.route.snapshot.params['id'];
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
            self.getPlayer(this.id);            
            console.log(self.currentUser);
        });
    }

    getPlayer(id) {
        let self = this;
        this.locationService.getPlayerbyId(id)
        .then(res=> {
            self.playerData = res.json();
            self.PlayerNameList = self.playerData.player_name;
            self.getBuildings();
            self.getFloors();
            self.getGroups();

            //self.displayEditImage();
    
            console.log("player================" + JSON.stringify(self.playerData));
        })
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
  
    getBuildings(){
        let self = this;
        this.customerService.getBuildings().then(
        res => {                
            self.buildings = res.json();
            console.log(self.buildings)
        },
        err => {        
            self.toastrService.error('Failed to get building list.', 'Error!!', {"positionClass": "toast-bottom-right"});
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
    
    ToggleMap(){
        for (let i = 0; i < this.floors.length; i++){
            if (this.playerData.floor_id == this.floors[i].short_name ){
                this.MapType = this.basePath + '/' + this.floors[i].map[0];
            }
        }
        //this.initaiteMap();
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
        console.log(this.playerData);
        this.locationService.updatePlayer(this.playerData).then(
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
    }
}