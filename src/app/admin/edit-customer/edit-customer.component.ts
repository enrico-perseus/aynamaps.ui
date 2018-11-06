import { Component, OnInit } from '@angular/core';
import {CustomerService} from "../../../components/auth/customer.service";
import {Router, ActivatedRoute, ParamMap} from "@angular/router";
import {environment} from "../../../environments/environment";

import { ToastrService } from 'ngx-toastr';
import { LanguageService } from '../../../components/auth/language.service';
import { IMultiSelectSettings, IMultiSelectTexts, IMultiSelectOption } from 'angular-2-dropdown-multiselect';

declare var jquery: any;
declare var Dropzone: any;
declare var $: any;

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html',
  styleUrls: ['./edit-customer.component.css']
})
export class EditCustomerComponent implements OnInit {

  basePath = environment.basePath;  
  customerData = {
    _id: '',
    name: '',
    email: '',
    role: '',
    account_name: '',
    account_type: '',
    license_type: '',
    subscription_type: '',
    kiosk_value: 1,
    is_kiosk_unlimited: false,
    destination_value: 1,
    is_destination_unlimited: false,
    building_value: 1,
    is_building_unlimited: false,
    user_value: 1,
    is_user_unlimited: false,
    subscription_start_date: new Date(),
    subscription_end_date: new Date(),
    sla_level: '',
    status: false,
    tour_3d: false,
    validity_start_date: new Date(),
    validity_end_date: new Date(),
    customer_images: [],
    // other info
    user_type: null,
    phone_number: '',
    po_box: '',
    company_address: '',
    fax: '',
    language:[]
  };

  singleSelectOption = {
    width: '100%'
  };
  multiSelectOption = {
    width: '100%',
    multiple: true,
    theme: 'classic',
    closeOnSelect: false
  };

  accountTypes = [
    { name: "On-Premise" },
    { name: "Cloud" },
  ];
  licenseTypes = [
    { name: "Full" },
    { name: "Trail" },
  ];
  subscriptionTypes = [
    { name: "Perputal" },
    { name: "SAAS" },
  ];
  slaLevels = [
    { name: "24x7" },
    { name: "9x5" },
  ];

  languages = [];
  myOptions: IMultiSelectOption[];
  
  toastrService: any
  customerService: any;
  languageService: any;
  Router: any;
  route: any;

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
    defaultTitle: 'Select Language',
    allSelected: 'All selected',
  };


  constructor(
    private _languageService: LanguageService,
    private _customerService: CustomerService,
    private _route: ActivatedRoute,
    private router: Router,
    private _toastrService: ToastrService
  ) {
    this.languageService = _languageService;
    this.customerService = _customerService;
    this.Router = router;
    this.route = _route;
    this.toastrService = _toastrService;
  }

  ngOnInit() {   

    this.initaiteImageDropzone();

    let id = this.route.snapshot.params['id'];
    this.getCustomer(id);
    this.getLanguages();
  }

  getLanguages() {
    let self = this;
    this.languageService.query().then(
      res => {                
        self.languages = res.json();
        console.log(self.languages)

        self.myOptions = [];
        for (var i = 0; i < self.languages.length; i++) {
          self.myOptions.push({id: self.languages[i]._id, name: self.languages[i].language});
        }
      },
      err => {        
        self.toastrService.error('Failed to get language list.', 'Error!!', {"positionClass": "toast-bottom-right"});
      }
    )
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
            maxFiles: 500,
            acceptedFiles : 'image/*,.pdf,.txt,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword',
            params: {
                _token: token
            },
            init: function() {
                this.on("addedfile", function(file) {
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
                    //angular.element($("#MainDiv")).scope().deleteUploadedImage(file);
                    self.deleteUploadedImage(file);
                })
            }
        }
    });
  }

  getCustomer(id) {
    let self = this;
    this.customerService.get({id: id})
    .toPromise()
    .then(user => {
        self.customerData = user;
        let tempLang = [];
        for (let i = 0; i < user.language.length; i++){
          tempLang.push(user.language[i]._id);
        }
        self.customerData.language = tempLang;
        self.displayEditImage();

    })
    .catch(err => {
      console.log(err);
      self.toastrService.error("Failed to get customer information.", 'Error!!', {"positionClass": "toast-bottom-right"});
    });
  }

  displayEditImage (){
    var myDropzone = new Dropzone("#fileupload");
    var filelist = this.customerData.customer_images;    
    if (filelist.length != undefined) {
        for (var i = 0; i < filelist.length; i++) {
            var st = filelist[i];
            var file_name = st.substring(st.lastIndexOf("/") + 1);
            var mockFile ={ name: file_name, size: 12345, attachment_id: file_name };
            
            myDropzone.options.addedfile.call(myDropzone, mockFile);
            myDropzone.options.thumbnail.call(myDropzone, mockFile, this.basePath + "/" + st);

            $('.dz-details .dz-size').addClass("hidden");
        }
    }    
  }

  deleteUploadedImage(file) {
    let self = this;
    this.customerService.deleteFile(this.customerData._id, file.name).then(
      res=> {        
        self.customerData = res.json();
        console.log(self.customerData.customer_images);
      },
      err => {
        alert("failed to delete");
      }
    )
  }

  uploadFiles() {
    var self = this;
    //$scope.submitted = true;
    var loopPromises = [];    
    var files = $('#fileupload').get(0).dropzone.getAcceptedFiles();   
    files.forEach(item => {
      if (item != null && item != undefined) {
        var promise = self.customerService.uploadFile(item);
        loopPromises.push(promise);
      }
    });    

    Promise.all(loopPromises)
      .then(values => {
        //console.log(JSON.stringify(values));
        var arr = values.map(function (elm) {
            return elm._body;
        });
        
        self.saveCustomData(arr);
      }, err => {
          alert(err);
      });      
  }


  save() {
    this.uploadFiles();
  }

  saveCustomData(data) {
    for (var i = 0; i < data.length; i++) {
      this.customerData.customer_images.push(data[i])
    }
    let self = this;    
    this.customerService.update(this.customerData).then(
      res => {        
        self.Router.navigate(['admin/dashboard']);
      },
      err => {
        console.log(err);
        if (err._body != undefined && err._body != null) {
          self.toastrService.error(err._body, 'Error!!', {"positionClass": "toast-bottom-right"});
        } else {
          self.toastrService.error("Failed to create customer account.", 'Error!!', {"positionClass": "toast-bottom-right"});
        }
      }
    )
  }

  cancel() {    
    this.Router.navigate(['admin/dashboard']);
  }

  subscriptionStartDateChanged() {
    var date = new Date(this.customerData.subscription_start_date);
    date.setFullYear(date.getFullYear() + 1);
    this.customerData.subscription_end_date = date;
  }

  validityStartDateChanged() {
    var date = new Date(this.customerData.validity_start_date);
    date.setFullYear(date.getFullYear() + 1);
    this.customerData.validity_end_date = date;
  }

  sendMail() {
    let self = this;
    this.customerService.sendMail(this.customerData.email).then(
      res => {        
        var resJson = JSON.parse(res._body);
        if (resJson['code'] == 1) {
          self.toastrService.success(resJson['message'], 'Success', {"positionClass": "toast-bottom-right"});
        } else {
          self.toastrService.error(resJson['message'], 'Error', {"positionClass": "toast-bottom-right"});
        }
      },
      err => {
        console.log(err);
      }
    )
  }
}