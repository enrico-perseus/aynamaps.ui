import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../components/auth/auth.service';
import { CustomerService } from "../../../../components/auth/customer.service";
import { LanguageService } from '../../../../components/auth/language.service';
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import {environment} from "../../../../environments/environment";


declare var jquery: any;
declare var Dropzone: any;
declare var $: any;

@Component({
    selector: 'app-edit-building',
    templateUrl: './edit-building.component.html',
    styleUrls: ['../../customer.item.edit.css']
})
export class EditBuildingComponent implements OnInit {

    basePath = environment.basePath;
    buildingData = {
        building_id: '',
        building_name: [],
        no_of_floors: 1,
        opening_hours: '',
        validity: '',
        country: '',
        city: '',
        tags: [],
        logo: [],
        info: '',
        floors_num: 0,
        status: true
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
    currentBuildingName = '';

    countries = [];
    timeslots = [];
    languages = [];
    Router: any;
    route: any;
    id = '';
    isAdd = true;  
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
        if (this.route.snapshot.params['id'] != ''){
            this.isAdd = false;
            this.id = this.route.snapshot.params['id'];
            console.log("id===========" + this.id);
        }
        console.log(this.isAdd);
    }

    ngOnInit() {
        this.initaiteImageDropzone();
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
            if (user.role == 'admin') {
                self.currentUser = user;
                if (!self.isAdd) {
                    self.getBuilding(this.id);
                } else {
                    self.getLanguages();
                }
                self.getCountries();
                self.getTimeslots();                
                console.log('currenUser========' + JSON.stringify(self.currentUser));
            }
        });
    }

    getBuilding(id) {
      let self = this;
      this.customerService.getBuildingbyId(id)
      .then(res=> {
        self.buildingData = res.json();
        self.displayEditImage();
        self.getLanguages();
        console.log("building================" + self.buildingData);
      })
    }

    displayEditImage (){
        var myDropzone = new Dropzone("#fileupload");
        var filelist = this.buildingData.logo;    
        if (filelist.length != undefined) {
            for (var i = 0; i < filelist.length; i++) {
                var st = filelist[i];
                var file_name = st.substring(st.lastIndexOf("/") + 1);
                var mockFile ={ name: file_name, size: 12345, attachment_id: file_name };
                
                myDropzone.options.addedfile.call(myDropzone, mockFile);
                myDropzone.options.thumbnail.call(myDropzone, mockFile, this.basePath + "/" + st);
                $('.dz-preview').css('width','98%');
                $('.dz-details .dz-size').addClass("hidden");
            }
        }    
      }

    getCountries(){
        let self = this;
        this.customerService.getCountries().then(
            res => {                
                self.countries = res.json();
            },
            err => {        
                self.toastrService.error('Failed to get country list.', 'Error!!', {"positionClass": "toast-bottom-right"});
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
            for (let i = 0; i < this.buildingData.building_name.length; i++){
                this.languages = this.languages.filter(item => item._id != this.buildingData.building_name[i].language);
            }
            this.getShowNameList();
        }        
    }

    addNameLanguage() {
        console.log("currentLanguage ===" + this.currentLanguage + "current Building_name===" + this.currentBuildingName);
        if (this.currentLanguage == "" || this.currentBuildingName == ""){
            this.toastrService.error('Add building name.', 'Error!!', {"positionClass": "toast-bottom-right"});
        } else {
            this.buildingData.building_name.push({
                language: this.currentLanguage,
                name: this.currentBuildingName        
            });
            this.languages = this.languages.filter(item => item._id != this.currentLanguage);
            this.currentLanguage = "";
            this.currentBuildingName = "";
            this.getShowNameList();
        }
        console.log(this.languages);        
    }

    getShowNameList(){
        this.showNameList = [];
        let temp = this.currentUser['language'];
        for (let i = 0; i < this.buildingData.building_name.length; i++){
           let langName = temp.filter(item => item._id  == this.buildingData.building_name[i].language);
           this.showNameList.push({name: this.buildingData.building_name[i].name, 
                                        language: langName[0].language,
                                        id: langName[0]._id});      
        }
        this.currentLanguage = "";       
    }

    removeNameLanguage(language) {
        console.log(language); 
        let temp = this.currentUser['language'];       
        let lang = temp.filter(item => item._id == language);
        this.buildingData.building_name = this.buildingData.building_name.filter(item => item.language != language);
        this.languages.push(lang[0]);
        this.getShowNameList();
    }

    initaiteImageDropzone() {
        let self = this;
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
            if (self.isAdd){
                var myDropzone = new Dropzone("#fileupload");
                console.log("here is mydropzone");
            }
        });
    }

    save(){
        console.log(this.buildingData);
        if (this.buildingData.building_name.length > 0){
            this.uploadFiles();
        } else {
            this.toastrService.error("The building name is required", 'Error!!', {"positionClass": "toast-bottom-right"});
        }
    }

    uploadFiles() {
        var self = this;
        var loopPromises = [];    
        var files = $('#fileupload').get(0).dropzone.getAcceptedFiles();   
        files.forEach(item => {
          if (item != null && item != undefined) {
            var promise = self.customerService.uploadBuildingFile(item);
            loopPromises.push(promise);
          }
        });    
    
        Promise.all(loopPromises)
          .then(values => {
            var arr = values.map(function (elm) {
                return elm._body;
            });
            
            self.saveBuildingData(arr);
          }, err => {          
              'The specified building name exist already.'
          });
      }

      saveBuildingData(data) {
        let self = this;        
        this.buildingData.logo = data;
        if (this.isAdd){
            this.customerService.createBuilding(this.buildingData).then(
                res => {                
                  self.Router.navigate(['/customer/home', { outlets: { popup: ['buildings'] } }]);
                },
                err => {
                  console.log(err);
                  if (err._body != undefined && err._body != null) {
                    self.toastrService.error(err._body, 'Error!!', {"positionClass": "toast-bottom-right"});
                  } else {
                    self.toastrService.error("Failed to create building.", 'Error!!', {"positionClass": "toast-bottom-right"});
                  }
                }
            )
        } else {
            this.customerService.editBuilding(this.buildingData).then(
            res => {                
                self.Router.navigate(['/customer/home', { outlets: { popup: ['buildings'] } }]);
            },
            err => {
                console.log(err);
                if (err._body != undefined && err._body != null) {
                self.toastrService.error(err._body, 'Error!!', {"positionClass": "toast-bottom-right"});
                } else {
                self.toastrService.error("Failed to edit building.", 'Error!!', {"positionClass": "toast-bottom-right"});
                }
            }
            )
        }
    }

    checkPositive(){
        if (this.buildingData.no_of_floors < 1){
            this.buildingData.no_of_floors = 1;
        }       
    }
}
