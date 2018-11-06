import { Component, OnInit } from '@angular/core';
import {CustomerService} from "../../../components/auth/customer.service";
import {Router} from "@angular/router";

import { ToastrService } from 'ngx-toastr';
import { LanguageService } from '../../../components/auth/language.service';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';

declare var jquery: any;
declare var Dropzone: any;
declare var $: any;

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.css']
})
export class AddCustomerComponent implements OnInit {

  customerData = {
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
    language: []
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
    private router: Router,
    private _toastrService: ToastrService
  ) {
    this.languageService = _languageService;
    this.customerService = _customerService;
    this.Router = router;
    this.toastrService = _toastrService;
    let date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    this.customerData.subscription_end_date = date;
    this.customerData.validity_end_date = date;
  }

  ngOnInit() {
    this.initaiteImageDropzone();
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
                  })
              }
          }

          var myDropzone = new Dropzone("#fileupload");
      });
  }
  
  save() {
    this.uploadFiles();
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
        var arr = values.map(function (elm) {
            return elm._body;
        });
        
        self.saveCustomData(arr);
      }, err => {          
          'The specified email address is already in use.'
      });
  }

  saveCustomData(data) {
    let self = this;        
    this.customerData.customer_images = data;

    this.customerService.create(this.customerData).then(
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

  checkPositive(){
    if (this.customerData.building_value < 1) this.customerData.building_value = 1;
    if (this.customerData.destination_value < 1) this.customerData.destination_value = 1;
    if (this.customerData.kiosk_value < 1) this.customerData.kiosk_value = 1;
    if (this.customerData.user_value < 1) this.customerData.user_value = 1;
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
}
