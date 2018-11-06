import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../components/auth/auth.service';
import { CustomerService } from "../../../../components/auth/customer.service";
import { LanguageService } from '../../../../components/auth/language.service';
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { environment } from "../../../../environments/environment";


declare var jquery: any;
declare var Dropzone: any;
declare var $: any;

@Component({
    selector: 'app-editfloorsmap-building',
    templateUrl: './edit-floorsmap.component.html',
    styleUrls: ['../../customer.item.edit.css']
})
export class EditFloorsmapComponent implements OnInit {

    basePath = environment.basePath;
    floorData = {
        short_name: '',
        long_name: [],
        floor_position: 0,
        opening_hours: '',
        validity: '',
        tags: [],
        logo: [],
        info: '',
        map: [],
        status: true,
        building_id: ''
    };

    public editorConfig = {
        theme: 'snow',
        placeholder: '',
        modules: {
        
        }
    }

    currentUser = {};

    authService: AuthService;
    customerService: CustomerService;
    toastrService: ToastrService;
    languageService: LanguageService;

    currentLanguage = '';
    currentLongName = '';
    building_floors = 0;
    freeFloors = [];
    timeslots = [];
    languages = [];
    Router: any;
    route: any; 
    id: ''; 
    isAdd = false;
    showNameList = [];
  
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
        this.id = this.route.snapshot.params['id'];
        console.log("id===========" + this.id);
        this.building_floors = this.route.snapshot.params['building_floors'];
        console.log("building_floors===========" + this.building_floors);
        
    }

    ngOnInit() {
        this.initaiteImageDropzone();

        this.reset();
        let self = this;
        this.authService.currentUserChanged.subscribe(user => {
            self.currentUser = user;
            self.reset();
            
            self.getFloor(this.id);
        });
        

    }

    reset() {
        let self = this;
        this.authService.getCurrentUser().then(user => {            
            if (user.role == 'admin'){
                self.currentUser = user;
                self.getTimeslots();
                self.getFloor(self.id);
                console.log(self.currentUser);
            }
        });
    }

    getFloor(id) {
        let self = this;
        this.customerService.getFloorbyId(id)
        .then(res=> {
          self.floorData = res.json();
          self.displayEditImage();
          self.getLanguages();
          self.getFloors();
          console.log("floorData================" + self.floorData);
        })
    }

    getFloors(){
        let self = this;
        let selectedBuilding = this.floorData.building_id;
        this.customerService.getFloorOrdersbyBuildingId(selectedBuilding).then(
            res => {                
              let floors = res.json();
              for (let i = 0; i < self.building_floors; i++){
                let addable = true;
                for (let j = 0; j < floors.length; j++){
                  if (i == floors[j].floor_position && i != self.floorData.floor_position){
                    addable = false;
                  }
                }
                if (addable == true) self.freeFloors.push(i);
              }

              console.log(self.freeFloors);
            },
            err => {        
              self.toastrService.error('Failed to get floors list.', 'Error!!', {"positionClass": "toast-bottom-right"});
            }
          )
      }

    displayEditImage (){
        var myDropzone = new Dropzone("#fileupload");
        console.log("k");
        var filelist = this.floorData.logo;    
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
        this.displayEditMap();

    }

    displayEditMap (){
        var myMapDropzone = new Dropzone("#mapupload");
        console.log("map");
        var filelist = this.floorData.map;    
        if (filelist.length != undefined) {
            for (var i = 0; i < filelist.length; i++) {
                var st = filelist[i];
                var file_name = st.substring(st.lastIndexOf("/") + 1);
                var mockFile ={ name: file_name, size: 12345, attachment_id: file_name };
                
                myMapDropzone.options.addedfile.call(myMapDropzone, mockFile);
                myMapDropzone.options.thumbnail.call(myMapDropzone, mockFile, this.basePath + "/" + st);
    
                $('.dz-details .dz-size').addClass("hidden");
                $('.dz-preview').css('width','98%');
  
            }
        }    
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
        for (let i = 0; i < this.floorData.long_name.length; i++){
            this.languages = this.languages.filter(item => item._id != this.floorData.long_name[i].language);
        }
        this.getShowNameList();        
    }

    addLongNameLanguage() {
        if (this.currentLanguage == "" || this.currentLongName == ""){
            this.toastrService.error('Add building name.', 'Error!!', {"positionClass": "toast-bottom-right"});
        } else {
            this.floorData.long_name.push({
                language: this.currentLanguage,
                name: this.currentLongName        
            });
            this.languages = this.languages.filter(item => item._id != this.currentLanguage);
            this.currentLanguage = "";
            this.currentLongName = "";
            this.getShowNameList();
        }
    }

    getShowNameList(){
        this.showNameList = [];
        let temp = this.currentUser['language'];
        for (let i = 0; i < this.floorData.long_name.length; i++){
           let langName = temp.filter(item => item._id  == this.floorData.long_name[i].language);
           this.showNameList.push({name: this.floorData.long_name[i].name, 
                                        language: langName[0].language,
                                        id: langName[0]._id});      
        }
        this.currentLanguage = "";       
    }

    removeLongNameLanguage(language) {
        console.log(language); 
        let temp = this.currentUser['language'];       
        let lang = temp.filter(item => item._id == language);
        this.floorData.long_name = this.floorData.long_name.filter(item => item.language != language);
        this.languages.push(lang[0]);
        this.getShowNameList();
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
        this.initaiteMapDropzone();
    }

    initaiteMapDropzone() {
        let self = this;
        $(document).ready(function () {
            Dropzone.autoDiscover = false;
            var token = "{!! csrf_token() !!}";

            Dropzone.options.mapupload = {
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
                        self.floorData.map = [];
                        console.log(file);
                    })
                }
            }

            //var myMapDropzone = new Dropzone("#mapupload");
        });
    }

    save(){
        console.log(this.floorData);
        if (this.floorData.long_name.length > 0){
            this.uploadFiles();
        } else {
            this.toastrService.error("The floor/map long name is required", 'Error!!', {"positionClass": "toast-bottom-right"});
        }
        //this.uploadFiles();
    }

    uploadFiles() {
        var self = this;
        //$scope.submitted = true;
        var loopPromises = [];    
        var files = $('#fileupload').get(0).dropzone.getAcceptedFiles();
        
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
            
            self.floorData.logo = arr;
            self.uploadMaps();
          }, err => {          
              'The specified building name exist already.'
          });
        } else {
            self.uploadMaps();
        }
    }

    uploadMaps() {
        var self = this;
        //$scope.submitted = true;
        var loopPromises = [];    
        var files = $('#mapupload').get(0).dropzone.getAcceptedFiles();
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
                self.floorData.map = arr;
                self.saveFloorData();
            }, err => {          
                'The specified floor name exist already.'
            });
        } else if (this.floorData.map.length == 0) {
                this.toastrService.error("The floor map is required", 'Error!!', {"positionClass": "toast-bottom-right"}); 
        } else {
            this.saveFloorData();
        }
    }
    
    saveFloorData() {
        let self = this;        
        //this.floorData.logo = data;
    
        this.customerService.editFloor(this.floorData).then(
            res => {                
                self.Router.navigate(['/customer/home', { outlets: { popup: ['floormaps'] } }]);
            },
            err => {
                console.log(err);
                if (err._body != undefined && err._body != null) {
                    self.toastrService.error(err._body, 'Error!!', {"positionClass": "toast-bottom-right"});
                } else {
                    self.toastrService.error("Failed to edit floor.", 'Error!!', {"positionClass": "toast-bottom-right"});
                }
            }
        )
    }
}
