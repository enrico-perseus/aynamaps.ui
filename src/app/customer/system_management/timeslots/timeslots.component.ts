import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { CustomerService } from "../../../../components/auth/customer.service";
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../components/auth/auth.service';
import {Router} from "@angular/router";

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-timeslots',
  templateUrl: './timeslots.component.html',
  styleUrls: ['./timeslots.component.css']
})
export class TimeslotsComponent implements OnInit {

  customerService: CustomerService;
  toastrService: ToastrService;
  authService : AuthService;
  router;
  viewRef: ViewContainerRef;
  timeslots = [];
  currentUser = {};

  selectedTimeslot = [];
  data = [];
  total = 0;
  p = 1;

  filter;
  key;
  reverse;

  constructor(private _authService: AuthService,
              private _toastrSevice: ToastrService,
              private _router: Router,
              private _viewRef: ViewContainerRef,
              private _customerService: CustomerService) { 
    this.authService = _authService;
    this.customerService = _customerService;
    this.toastrService = _toastrSevice;
    this.router = _router;
    this.viewRef = _viewRef;
  }

  ngOnInit() {
    this.reset();
    $(document).ready(function() {
      var $searchTrigger = $('[data-ic-class="search-trigger"]'),
      $searchInput = $('[data-ic-class="search-input"]'),
      $searchClear = $('[data-ic-class="search-clear"]');
      $searchTrigger.click(function () {
          var $this = $('[data-ic-class="search-trigger"]');
          $this.addClass('active');
          $searchInput.focus();
      });
      
      $searchInput.blur(function () {
          if ($searchInput.val().length > 0) {
              return false;
          } else {
              $searchTrigger.removeClass('active');
          }
      });
    });
  }

  reset() {
    let self = this;
    this.authService.getCurrentUser().then(user => {      
      self.currentUser = user;
      self.getTimeslots();
    });    
  }

  getTimeslots(){
    let self = this;
    this.customerService.getTimeslots().then(
      res => {                
        this.timeslots = res.json();
        console.log(this.timeslots)
      },
      err => {        
        self.toastrService.error('Failed to get timeslot list.', 'Error!!', {"positionClass": "toast-bottom-right"});
      }
    )
  }

  editTimeslot() {
    if (this.selectedTimeslot.length == 1)
      this.router.navigate(['customer/home', { outlets: { popup: ['edittimeslots', this.selectedTimeslot[0]._id] } }]);
  }

  deleteTimeslot() {
    let self = this;
    if (this.selectedTimeslot.length == 1){
      let selectedTimeslot_name = '';
      for (let i = 0; i < this.timeslots.length; i ++){
        if (this.timeslots[i]._id == this.selectedTimeslot[0]._id) selectedTimeslot_name = this.timeslots[i].name;
      }
      this.customerService.getUsingbyTimeslotName(selectedTimeslot_name).then(
        res => {                
          self.data = res.json();
          console.log(self.data);
          if (self.data.length == 0){
            return this.customerService.removeTimeslot(this.selectedTimeslot[0]._id).then(
              res => {
                self.getTimeslots();
                self.selectedTimeslot = [];
              },
              err => {
                console.log(err);
                if (err._body != undefined && err._body != null) {
                  self.toastrService.error(err._body, 'Error!!', {"positionClass": "toast-bottom-right"});
                } else {
                  self.toastrService.error("Failed to remove timesolt.", 'Error!!', {"positionClass": "toast-bottom-right"});
                }
              }
            )
          } else {
            self.total = 0;
            for (let i = 0; i < self.data.length ; i++){
              self.total = self.total + self.data[i].position.length;
            }
            $("#searchPage").show();
            $("#MainPage").hide();
          }          
      },
      err => {        
          self.toastrService.error('Failed to get using list.', 'Error!!', {"positionClass": "toast-bottom-right"});
      }
      )
    }
  }

  searchPageHide(){
    $("#MainPage").show();
    $("#searchPage").hide();
  }

  routeItem(itemName: String){
    this.router.navigate(['customer/home', { outlets: { popup: [itemName] } }]);
  }  

  selectTimeslot(timeslot) {
    timeslot.selected = !timeslot.selected;
    if (timeslot.selected) {
      this.selectedTimeslot.push({_id: timeslot._id});
    } else {
      this.selectedTimeslot = this.selectedTimeslot.filter(item => item._id != timeslot._id);
    }
  }

  openMenu() {
    var x = document.getElementById("langNav");    
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
  }

  exportToPDF() {
    $('#categoryTable').tableExport({type:'pdf',escape:'false', tableName:'timeslots'});
  }

  exportToExcel() {
    $('#categoryTable').tableExport({type:'excel',escape:'false', tableName:'timeslots'});
  }

}
