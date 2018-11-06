import { EventEmitter, Output, Input,Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../../components/auth/auth.service';
import { CustomerService } from '../../../../../components/auth/customer.service';
import { LanguageService } from '../../../../../components/auth/language.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';

declare var jquery: any;
declare var Dropzone: any;
declare var $: any;

@Component({
    selector: 'app-addflooraccess',
    templateUrl: './add-flooraccess.component.html',
    styleUrls: ['./add-flooraccess.component.css']
})
export class AddFlooraccessComponent implements OnInit {

    basePath = environment.basePath;
    floorData = {
        flooraccess_code: '',
        building_id: '',
        floor_id_from: [],
        floor_id_to: [],
        type: '',
        parent: '',
        validity: '',
        accessibility: true,
        status: true,
        tags: [],
        latitude: 0.0,
        longitude: 0.0,
        flooraccess_position: []
    };
    fifPosition = {
        latitude: 0.0,
        longitude: 0.0
    }
    fitPosition = {
        latitude: 0.0,
        longitude: 0.0
    }
    singleSelectOption = {
        width: '100%'
    };
    multiSelectOption = {
        width: '100%',
        multiple: true,
        theme: 'classic',
        closeOnSelect: false
    };
        
    AccessibilityType = [
        { name: 'Escalator' }, 
        { name: 'Elevator' }, 
        { name: 'Stairs' }
    ];

    public editorConfig = {
        theme: 'snow',
        placeholder: '',
        modules: {
        
        }
    }

    currentUser = {};
    myOptions: IMultiSelectOption[];
    fifOptions: IMultiSelectOption[];
    fitOptions: IMultiSelectOption[];
    mySettings: IMultiSelectSettings = {
        //enableSearch: true,
        checkedStyle: 'fontawesome',
        selectionLimit: 1,
        autoUnselect: true,
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
        defaultTitle: 'Select Floors',
        allSelected: 'All selected',
    };

    authService: AuthService;
    customerService: CustomerService;
    toastrService: ToastrService;
    languageService: LanguageService;
    Router: any;
    route: ActivatedRoute; 

    currentLanguage = '';
    currentLongName = '';

    timeslots = [];
    floors = [];
    fifselected = '';
    fifaccessable =[];
    fitselected = '';
    fitaccessable =[];

    @Output() showTab = new EventEmitter();

// I used 'ul', I'm not familiarized with bootstrap events,
// so I don't really know where the event is being attached
    constructor(private _authService: AuthService,
                private _customerService: CustomerService,
                private _toastrService: ToastrService,
                private _languageService: LanguageService,
                private router: Router,
                private _route: ActivatedRoute) { 
        this.authService = _authService;
        this.customerService = _customerService;
        this.toastrService = _toastrService;
        this.languageService = _languageService;
        this.Router = router;
        this.route = _route;
    }
    ngOnInit() {
        this.reset();
        let self = this;
        this.authService.currentUserChanged.subscribe(user => {
            self.currentUser = user;
            self.reset();
        });



    }
    timeOut1;
    onTabFrom(){
        let self = this;
        var $img = $('div.from-map.active img');
        if ( $img.length != 0)
        {
            var k;
            if ((k = this.isInArray(this.floorData.flooraccess_position, $('div.from-map.active').attr('id').substr(5), 'id')) != null){
                this.floorData.flooraccess_position[k].fromlatitude = this.fifPosition.latitude;
                this.floorData.flooraccess_position[k].fromlongitude = this.fifPosition.longitude;
            }else{
                this.floorData.flooraccess_position.push({id:$('div.from-map.active').attr('id').substr(5), fromlatitude : this.fifPosition.latitude, fromlongitude: this.fifPosition.longitude ,tolatitude: 0, tolongitude: 0});
            }
            $img.imgNotes('destroy');

        }
        if (this.timeOut1) clearTimeout(this.timeOut1);
        this.timeOut1 = setTimeout(function(){
            let id = $('div.from-map.active').attr('id').substr(5);
            let i,notes;

            if ((i = self.isInArray(self.floorData.flooraccess_position, id, 'id')) != null){
                notes = [{x: self.floorData.flooraccess_position[i].fromlatitude, y: self.floorData.flooraccess_position[i].fromlongitude, note: 'fif'}];
            } else{
                notes = [{x: 0, y:0, note: 'fif'}];
            }
            $('div.from-map.active img').imgNotes({}).imgNotes('import',notes).imgNotes("option","canEdit", true);

            self.fifactiveimgid ='#' +  $('div.from-map.active img').attr('id');
        },300);
    }
    timeOut2;
    onTabTo(){
        let self = this;
        var $img = $('div.to-map.active img');
        if ( $img.length != 0)
        {
            var k;
            if ((k = this.isInArray(this.floorData.flooraccess_position, $('div.to-map.active').attr('id').substr(3), 'id')) != null){
                this.floorData.flooraccess_position[k].tolatitude = this.fitPosition.latitude;
                this.floorData.flooraccess_position[k].tolongitude = this.fitPosition.longitude;
            }else{
                this.floorData.flooraccess_position.push({id:$('div.to-map.active').attr('id').substr(3), fromlatitude : 0, fromlongitude: 0,tolatitude : this.fitPosition.latitude, tolongitude: this.fitPosition.longitude });
            }
            $img.imgNotes('destroy');
        }
        if (this.timeOut2) clearTimeout(this.timeOut2);
        this.timeOut2 = setTimeout(function(){
            let id = $('div.to-map.active').attr('id').substr(3);
            let i,notes;

            if ((i = self.isInArray(self.floorData.flooraccess_position, id, 'id')) != null){
                notes = [{x: self.floorData.flooraccess_position[i].tolatitude, y: self.floorData.flooraccess_position[i].tolongitude, note: 'fit'}];
            } else{
                notes = [{x: 0, y:0, note: 'fit'}];
            }
            $('div.to-map.active img').imgNotes({}).imgNotes('import',notes).imgNotes("option","canEdit", true);

            self.fitactiveimgid ='#' +  $('div.to-map.active img').attr('id');

        },300);
    }
    reset() {
        let self = this;
        this.authService.getCurrentUser().then(user => {      
            self.currentUser = user;
            self.getTimeslots();
            console.log(self.currentUser);
            self.floorData.building_id = this.route.snapshot.params['building_id'];
            self.getFloors(self.floorData.building_id);

            console.log("building_id===========" + this.floorData.building_id);
                
        });
    }

    getTimeslots(){
        let self = this;
        this.customerService.getTimeslots().then(
        res => {                
            self.timeslots = res.json();
            console.log(self.timeslots);
        },
        err => {        
            self.toastrService.error('Failed to get timeslot list.', 'Error!!', {"positionClass": "toast-bottom-right"});
        }
        )  
    }

    getFloors(id){
        let self = this;
        this.customerService.getFloorsbyBuildingId(id).then(
          res => {                
            self.floors = res.json()[0].floors;
            self.myOptions = [];
            for (var i = 0; i < self.floors.length; i++) {
                self.myOptions.push({id: self.floors[i]._id, name: self.floors[i].short_name});
            }     
            self.getOptions();//self.fitOptions = self.fifOptions;
          },
          err => {        
            self.toastrService.error('Failed to get floors list.', 'Error!!', {"positionClass": "toast-bottom-right"});
          }
        )
    }
    
    getOptions(){
        this.fifOptions = this.myOptions;
        this.fitOptions = this.myOptions;
        if (this.floorData.type != 'Elevator'){
            if (this.floorData.floor_id_from.length > 0) this.fitOptions = this.myOptions.filter(item => item.id != this.floorData.floor_id_from[0]);
            if (this.floorData.floor_id_to.length > 0) this.fifOptions = this.myOptions.filter(item => item.id != this.floorData.floor_id_to[0]);
        }

    }

    typechange(){
        if(this.floorData.type == 'Elevator'){
            this.mySettings = {
                checkedStyle: 'fontawesome',
                //selectionLimit: 1,
                //autoUnselect: true,
                dynamicTitleMaxItems: 3,
                displayAllSelectedText: true
            };
        } else {
            this.mySettings = {
                checkedStyle: 'fontawesome',
                selectionLimit: 1,
                autoUnselect: true,
                minSelectionLimit: 0,
                closeOnSelect: true,
                dynamicTitleMaxItems: 3,
                displayAllSelectedText: true
            };
        }
    }
    fifactiveimgid = null;
    fifactiveimgselected = false;
    fitactiveimgid = null;
    fitactiveimgselected = false;
    fifchange(){
        console.log(this.fifselected);
        this.fifaccessable = [];
        this.fifactiveimgselected = false;
        if (this.fifactiveimgid != null && $('div.from-map.active').length != 0){
            var k;
            if ((k = this.isInArray(this.floorData.flooraccess_position, $('div.from-map.active').attr('id').substr(5), 'id')) != null){
                this.floorData.flooraccess_position[k].fromlatitude = this.fifPosition.latitude;
                this.floorData.flooraccess_position[k].fromlongitude = this.fifPosition.longitude;
            }else{
                this.floorData.flooraccess_position.push({id:$('div.from-map.active').attr('id').substr(5), fromlatitude : this.fifPosition.latitude, fromlongitude: this.fifPosition.longitude,tolatitude: 0,tolongitude: 0 });
            }
            $(this.fifactiveimgid).imgNotes('destroy');
        }
        for (var i = 0 ; i < this.floorData.floor_id_from.length; i++){
            let k = this.isInArray(this.floors, this.floorData.floor_id_from[i],'_id');
            if (k != null){
                if (this.fifactiveimgid == null){
                    this.fifactiveimgid = '#imagefif' + this.floors[k].short_name;
                }
                if (this.fifactiveimgid.substr(9) == this.floors[k].short_name)
                {
                    this.fifaccessable.push({active: true, id: this.floors[k]._id, name: this.floors[k].short_name, map: this.floors[k].map});
                    this.fifactiveimgselected = true;
                }
                else
                {
                    this.fifaccessable.push({active: false, id: this.floors[k]._id, name: this.floors[k].short_name, map: this.floors[k].map});
                }
            }
        }
        if (this.floorData.floor_id_from.length != 0 && this.fifactiveimgselected == false)
        {
            this.fifaccessable[0].active = true;
            this.fifactiveimgid = '#imagefif' + this.fifaccessable[0].name;
            this.fifactiveimgselected = true;
        }
        // for (let i = 0; i < this.floors.length; i++){
        //     for (let j = 0; j < this.floorData.floor_id_from.length; j++){
        //         if (this.floors[i]._id == this.floorData.floor_id_from[j]) {
        //             let temp = {
        //                 index: k,
        //                 id: this.floors[i]._id,
        //                 name: this.floors[i].short_name,
        //                 map: this.floors[i].map
        //             }
        //             k++;
        //             this.fifaccessable.push(temp);
        //         }
        //     }
        // }

        this.getOptions();
        console.log("fifacceable=" + JSON.stringify(this.fifaccessable));
    }

    fitchange(){
        console.log(this.fitselected);
        this.fitaccessable = [];
        this.fitactiveimgselected = false;
        if (this.fitactiveimgid != null && $('div.to-map.active').length != 0){
            var k;
            if ((k = this.isInArray(this.floorData.flooraccess_position, $('div.to-map.active').attr('id').substr(3), 'id')) != null){
                this.floorData.flooraccess_position[k].tolatitude = this.fitPosition.latitude;
                this.floorData.flooraccess_position[k].tolongitude = this.fitPosition.longitude;
            }else{
                this.floorData.flooraccess_position.push({id:$('div.to-map.active').attr('id').substr(3), fromlatitude: 0,fromlongitude: 0,tolatitude : this.fitPosition.latitude, tolongitude: this.fitPosition.longitude });
            }
            $(this.fitactiveimgid).imgNotes('destroy');
        }
        for (var i = 0 ; i < this.floorData.floor_id_to.length; i++){
            let k = this.isInArray(this.floors, this.floorData.floor_id_to[i],'_id');
            if (k != null){
                if (this.fitactiveimgid == null){
                    this.fitactiveimgid = '#imagefit' + this.floors[k].short_name;
                }
                if (this.fitactiveimgid.substr(9) == this.floors[k].short_name)
                {
                    this.fitaccessable.push({active: true, id: this.floors[k]._id, name: this.floors[k].short_name, map: this.floors[k].map});
                    this.fitactiveimgselected = true;
                }
                else
                {
                    this.fitaccessable.push({active: false, id: this.floors[k]._id, name: this.floors[k].short_name, map: this.floors[k].map});
                }
            }
        }
        if (this.floorData.floor_id_to.length != 0 && this.fitactiveimgselected == false)
        {
            this.fitaccessable[0].active = true;
            this.fitactiveimgid = '#imagefit' + this.fitaccessable[0].name;
            this.fitactiveimgselected = true;
        }
        this.getOptions();
        console.log("fitacceable=" + JSON.stringify(this.fitaccessable));
    }

    isInArray(array,param,idx){
        for (var i = 0; i < array.length; i++){
            if (array[i][idx] == param)
                return i;
        }
        return null;
    }
    initaiteMap(logo, isFrom) {
        if (logo.active == false)
            return;

        var notes;
        var i;

        if ((i = this.isInArray(this.floorData.flooraccess_position, logo.id, 'id')) != null){
            notes = [{x: isFrom ? this.floorData.flooraccess_position[i].fromlatitude:this.floorData.flooraccess_position[i].tolatitude , y: isFrom? this.floorData.flooraccess_position[i].fromlongitude: this.floorData.flooraccess_position[i].tolongitude, note: isFrom ? 'fif': 'fit'}];
        } else{
            notes = [{x: 0, y:0, note: isFrom ? 'fif': 'fit'}];
        }

        var img = $(isFrom ? 'div.from-map.active img' : 'div.to-map.active img').imgNotes({});
        img.imgNotes('import', notes);
        img.imgNotes("option","canEdit", true);
        // } else if (note == 'fit'){
        //     if (this.fitaccessable.length == 1) {
        //         this.fitactiveimg = name;
        //     }
        // }
        // if (allowed == false)
        // {
        //     $(this.fifactiveimg).addClass('has-note');
        //     $(this.fitactiveimg).addClass('has-note');
        //     return;
        // }else{
        //     if (this.fifactiveimg != null)
        //         this.fifactiveimg = null;
        //     if (this.fitactiveimg != null)
        //         this.fitactiveimg = null;
        // }
        // var note = name.substr(6,3);
        // var notes = [{x: this.floorData.latitude, y:this.floorData.longitude, note: note}];
        // if (note == 'fif')
        // {
        //     if (this.fifactiveimg == null){
        //         this.fifactiveimg = name;
        //         var $img0 = $(name);
        //         var $img = $img0.imgNotes({});
        //         $img.imgNotes("import", notes);
        //     }
        //     $(this.fifactiveimg).addClass('has-note');
        // }
        // else if(note == 'fit'){
        //     if (this.fitactiveimg == null){
        //         this.fitactiveimg = name;
        //         var $img0 = $(name);
        //         var $img = $img0.imgNotes({});
        //         $img.imgNotes("import", notes);
        //     }
        //     $(this.fitactiveimg).addClass('has-note');
        // }

    }

    save(){
        console.log(this.floorData);
        let self = this;
        var fifpanel = $('div.from-map.active');
        var fitpanel = $('div.to-map.active');
        if (fifpanel.length != 0){
            let k = this.isInArray(this.floorData.flooraccess_position, fifpanel.attr('id').substr(5),'id');
            if (k != null){
                this.floorData.flooraccess_position[k].fromlatitude = this.fifPosition.latitude;
                this.floorData.flooraccess_position[k].fromlongitude = this.fifPosition.longitude;
            }else{
                this.floorData.flooraccess_position.push({id:$('div.from-map.active').attr('id').substr(5), fromlatitude : this.fifPosition.latitude, fromlongitude: this.fifPosition.longitude,tolatitude: 0,tolongitude: 0 });
            }
        }
        if (fitpanel.length !=0){
            let k = this.isInArray(this.floorData.flooraccess_position, fitpanel.attr('id').substr(3), 'id');
            if (k != null){
                this.floorData.flooraccess_position[k].tolatitude = this.fitPosition.latitude;
                this.floorData.flooraccess_position[k].tolongitude = this.fitPosition.longitude;
            }else{
                this.floorData.flooraccess_position.push({id:$('div.to-map.active').attr('id').substr(3), fromlatitude: 0,fromlongitude: 0,tolatitude : this.fitPosition.latitude, tolongitude: this.fitPosition.longitude });
            }
        }
        this.customerService.createFloorAccess(this.floorData).then(
            res => {                
                self.Router.navigate(['/customer/home', { outlets: { popup: ['flooraccess'] } }]);
            },
            err => {
                console.log(err);
                if (err._body != undefined && err._body != null) {
                    self.toastrService.error(err._body, 'Error!!', {"positionClass": "toast-bottom-right"});
                } else {
                    self.toastrService.error("Failed to create floor.", 'Error!!', {"positionClass": "toast-bottom-right"});
                }
            }
        )
    }    
}
