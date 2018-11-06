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
    selector: 'app-editemergencies',
    templateUrl: './edit-emergencies.component.html',
    styleUrls: ['../../../customer.item.edit.css']
})
export class EditEmergenciesComponent implements OnInit {

    basePath = environment.basePath;
    emergencyData = {
        _id: '',
        emergency_code: '',
        uid: '',    
        building_id: '',
        floor_id: '',
        emergency_name: [],
        category: '',
        current_status: '',
        parent: '',
        opening_hours: '',    
        validity: '',    
        logo: [],
        emergency_icon: [],
        website: '',
        email: '',
        phone: '',
        info: '',
        tags: [],
        latitude: 0.0,
        longitude: 0.0,
        status: false
    };

    MapType = '';
    
    public editorConfig = {
        theme: 'snow',
        placeholder: '',
        modules: {
          
        }
    }
    
    currentUser = {};
    currentLanguage = '';
    currentName = '';
    
    timeslots = [];
    languages = [];
       
    categoryList = [];
    
    locationService: LocationService;
    
    authService: AuthService;
    customerService: CustomerService;
    toastrService: ToastrService;
    languageService: LanguageService;
    Router: any;
    route: any;
    isAdd = false;
    showNameList = []; 
  
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
    }
    
    ngOnInit() {
        this.initaiteImageDropzone();
        this.reset();
        let self = this;
        this.authService.currentUserChanged.subscribe(user => {
            self.currentUser = user;
            self.reset();
        });
        let id = this.route.snapshot.params['id'];
        this.getEmergency(id);
    }
    
    reset() {
        let self = this;
        this.authService.getCurrentUser().then(user => {      
            self.currentUser = user;
            self.loadCategories();
            self.getTimeslots();
            console.log(self.currentUser);          
        });
    }

    getEmergency(id) {
        let self = this;
        this.customerService.getEmergencybyId(id)
        .then(res=> {
          self.emergencyData = res.json();
          self.displayEditImage();
          self.getLanguages();
          self.getFloors();
          //self.initaiteMap();    
          console.log("emergency data ================" + self.emergencyData);
        })
    }

    getFloors(){
        let self = this;
        this.customerService.getFloors().then(
          res => {                
            let floors = res.json();
            for (let i = 0; i < floors.length; i++){
                if (floors[i].building_id = self.emergencyData.building_id && floors[i].short_name == self.emergencyData.floor_id){
                    self.MapType = self.basePath + '/' + floors[i].map[0];
                }
            }      
            console.log("Maptype ======= " + self.MapType);
          },
          err => {        
            self.toastrService.error('Failed to get floors list.', 'Error!!', {"positionClass": "toast-bottom-right"});
          }
        )
    }

    displayEditImage (){
        var myDropzone = new Dropzone("#fileupload");
        console.log("k");
        var filelist = this.emergencyData.logo;    
        if (filelist.length != undefined) {
            for (var i = 0; i < filelist.length; i++) {
                var st = filelist[i];
                var file_name = st.substring(st.lastIndexOf("/") + 1);
                var mockFile ={ name: file_name, size: 12345, attachment_id: file_name };
                
                myDropzone.options.addedfile.call(myDropzone, mockFile);
                myDropzone.options.thumbnail.call(myDropzone, mockFile, this.basePath + "/" + st);
    
                $('.dz-details .dz-size').addClass("hidden");
                $('.dz-preview').css('width','98%');
            }
        }    
        this.displayEditICon();    
    }
    
    displayEditICon(){
        var myIconDropzone = new Dropzone("#iconupload");
        console.log("k");
        var filelist = this.emergencyData.emergency_icon;    
        if (filelist.length != undefined) {
            for (var i = 0; i < filelist.length; i++) {
                var st = filelist[i];
                var file_name = st.substring(st.lastIndexOf("/") + 1);
                var mockFile ={ name: file_name, size: 12345, attachment_id: file_name };
                
                myIconDropzone.options.addedfile.call(myIconDropzone, mockFile);
                myIconDropzone.options.thumbnail.call(myIconDropzone, mockFile, this.basePath + "/" + st);
                $('.dz-details .dz-size').addClass("hidden");
                $('.dz-preview').css('width','98%');
            }
        }    
    }
    
    loadCategories() {
        let self = this;
        this.locationService.getCategory().toPromise()
        .then(
            categories => {                                
                self.categoryList = categories;
            },
            err => {
                console.log(err);        
            }
        )
    }
    
    getTimeslots(){
        let self = this;
        this.customerService.getTimeslots().then(
        res => {                
            self.timeslots = res.json();
            console.log(self.timeslots)
        },
        err => {        
            self.toastrService.error('Failed to get timeslot list.', 'Error!!', {"positionClass": "toast-bottom-right"});
        }
        )  
    }
    
    getLanguages(){
        this.languages = this.currentUser['language'];
        if (!this.isAdd){
            for (let i = 0; i < this.emergencyData.emergency_name.length; i++){
                this.languages = this.languages.filter(item => item._id != this.emergencyData.emergency_name[i].language);
            }
            this.getShowNameList();
        }        
    }
    
    addNameLanguage() {
        if (this.currentLanguage == "" || this.currentName == ""){
            this.toastrService.error('Add building name.', 'Error!!', {"positionClass": "toast-bottom-right"});
        } else {
            this.emergencyData.emergency_name.push({
                language: this.currentLanguage,
                name: this.currentName        
            });
            this.languages = this.languages.filter(item => item._id != this.currentLanguage);
            this.currentLanguage = "";
            this.currentName = "";
            this.getShowNameList();
        }
    }

    getShowNameList(){
        this.showNameList = [];
        let temp = this.currentUser['language'];
        for (let i = 0; i < this.emergencyData.emergency_name.length; i++){
        let langName = temp.filter(item => item._id  == this.emergencyData.emergency_name[i].language);
        this.showNameList.push({name: this.emergencyData.emergency_name[i].name, 
                                        language: langName[0].language,
                                        id: langName[0]._id});      
        }
        this.currentLanguage = "";       
    }
    
    removeNameLanguage(language) {
        console.log(language);
        let temp = this.currentUser['language'];       
        let lang = temp.filter(item => item._id == language);
        this.emergencyData.emergency_name = this.emergencyData.emergency_name.filter(item => item.language != language);
        this.languages.push(lang[0]);
        this.getShowNameList();
    }

    initaiteMap(){
        let self  = this;
        $(document).ready(() => {
            setTimeout(() => {
                   var notes = [{x: self.emergencyData.latitude, y:self.emergencyData.longitude, note:"emergency"}];
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
    
    initaiteImageDropzone() {
        $(document).ready(function () {
            Dropzone.autoDiscover = false;
            var token = "{!! csrf_token() !!}";
    
            Dropzone.options.fileupload = {
                url: "/project/uploadImage",
                paramName: "file",
                autoProcessQueue: false,
                maxFiles: 1,
                acceptedFiles : 'image/*,.pdf,.txt,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword',
                params: {
                    _token: token
                },
                init: function() {
                    this.on("addedfile", function(file) {
                        $('.dz-preview').css('width','98%');
                        console.log(file,'file');
                    }),
    
                    this.on("success", function(file, response) {
                        console.log(response,'success');
                        // $('#botofform').append('<input type="hidden" name="files[]" value="'+ response +'">');
                    }),
                
                    this.on("uploadprogress", function(file, progress, bytesSent) {
                        console.log(progress,'progress') 
                        //$('#botofform').append('<input type="hidden" name="files[]" value="'+ response +'">');
                    }),
                
                    this.on("removedfile", function(file) {
                        console.log(file);
                    })
                }
            }
    
            //var myDropzone = new Dropzone("#fileupload");
        });
        this.initaiteIconDropzone();
    }
    
    initaiteIconDropzone() {
        let self  = this;
        $(document).ready(function () {
            Dropzone.autoDiscover = false;
            var token = "{!! csrf_token() !!}";
    
            Dropzone.options.iconupload = {
                url: "/project/uploadImage",
                paramName: "file",
                autoProcessQueue: false,
                maxFiles: 1,
                acceptedFiles : 'image/*,.pdf,.txt,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword',
                params: {
                    _token: token
                },
                init: function() {
                    this.on("addedfile", function(file) {
                        $('.dz-preview').css('width','98%');
                        console.log(file,'file');
                    }),
    
                    this.on("success", function(file, response) {
                        console.log(response,'success');
                        // $('#botofform').append('<input type="hidden" name="files[]" value="'+ response +'">');
                    }),
                
                    this.on("uploadprogress", function(file, progress, bytesSent) {
                        console.log(progress,'progress') 
                        //$('#botofform').append('<input type="hidden" name="files[]" value="'+ response +'">');
                    }),
                
                    this.on("removedfile", function(file) {
                        self.emergencyData.emergency_icon = [];
                        console.log(file);
                    })
                }
            }
    
            //var myIconDropzone = new Dropzone("#iconupload");
        });
    }
    
    save(){
        console.log(this.emergencyData);
        if (this.emergencyData.emergency_name.length > 0){
            this.uploadFiles();
        } else {
            this.toastrService.error("The emergency name is required", 'Error!!', {"positionClass": "toast-bottom-right"});
        } 
    }
    
    uploadFiles() {
        var self = this;
        //$scope.submitted = true;
        var loopPromises = [];    
        var files = $('#fileupload').get(0).dropzone.getAcceptedFiles();   
        files.forEach(item => {
            if (item != null && item != undefined) {
            var promise = self.customerService.uploadEmergencyFile(item);
            loopPromises.push(promise);
            }
        });    
        
        Promise.all(loopPromises)
            .then(values => {
            var arr = values.map(function (elm) {
                return elm._body;
            });
            
            self.emergencyData.logo = arr;
            self.uploadIcon();
            }, err => {          
                'The specified Emergency name exist already.'
            });
    }

    uploadIcon() {
        var self = this;
        //$scope.submitted = true;
        var loopPromises = [];    
        var files = $('#iconupload').get(0).dropzone.getAcceptedFiles();
        if (files.length > 0) {   
            files.forEach(item => {
            if (item != null && item != undefined) {
                var promise = self.customerService.uploadFloorFile(item);
                loopPromises.push(promise);
            }
            });    
        
            Promise.all(loopPromises)
            .then(values => {
                var arr = values.map(function (elm) {
                    return elm._body;
                });
                self.emergencyData.emergency_icon = arr;
                self.saveEmergencyData();
            }, err => {          
                'The specified emergency name exist already.'
            });
        } else if( self.emergencyData.emergency_icon.length > 0){
            self.saveEmergencyData();
        } else {
            self.toastrService.error("Emergency icon is required.", 'Error!!', {"positionClass": "toast-bottom-right"});
        }
    }
    
    
    saveEmergencyData() {
      let self = this;        
      //this.emergencyData.logo = data;
    
        this.customerService.editEmergency(this.emergencyData).then(
            res => {                
            self.Router.navigate(['/customer/home', { outlets: { popup: ['emergencies'] } }]);
            },
            err => {
                console.log(err);
                if (err._body != undefined && err._body != null) {
                    self.toastrService.error(err._body, 'Error!!', {"positionClass": "toast-bottom-right"});
                } else {
                    self.toastrService.error("Failed to create Emergency.", 'Error!!', {"positionClass": "toast-bottom-right"});
                }
            }
        )
    }
}