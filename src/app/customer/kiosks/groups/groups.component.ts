import { Component, OnInit, ContentChildren, QueryList } from '@angular/core';
import { AuthService } from '../../../../components/auth/auth.service';
import { LocationService } from '../../../../components/auth/location.service';
import { ToastrService } from 'ngx-toastr';
import { GroupItemComponent } from './group-item/group-item.component';
import { Router } from '@angular/router';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['../../customer.item.css']
})
export class GroupsComponent implements OnInit {

  currentUser = {};
  selectedGroups = {};

  authService: AuthService;  
  locationService: LocationService;
  toastrService: any;
  router;
  
  groups = [];
  filter;
  usages = 0;
  data = [];
  total = 0;

  constructor(private _authService: AuthService,
              private _locationService: LocationService,
              private _toastrService: ToastrService,
              private _router: Router) { 
    this.authService = _authService;
    this.locationService = _locationService;
    this.toastrService = _toastrService;
    this.router = _router;
  }

  ngOnInit() {
    this.reset();
    let self = this;
    this.authService.currentUserChanged.subscribe(user => {
        self.currentUser = user;
        self.reset();
    });

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
      self.loadGroups();
    });
  }

  loadGroups() {
    let self = this;
    this.locationService.getGroup().toPromise()
    .then(
      groups => {                
        self.selectedGroups = [];        
        self.groups = groups;
        for (let i = 0; i < self.groups.length; i++){
          self.groups[i].usagesLength = self.groups[i].usage.length;
        }
        console.log("groups====" + JSON.stringify(self.groups));
      },
      err => {
        console.log(err);        
      }
    )
  }

  addGroup() {
    this.groups.push({
      group_name: '',
      _id: '',
      createdBy: {
        email: this.currentUser['email'],
        _id: this.currentUser['_id']
      },
      status: 'Enable',
      isEdit: true
    });
  }

  onGroupAdded(group) {    
    this.loadGroups();
  } 

  selectGroup(id) {
    if (this.selectedGroups[id]) {
      this.selectedGroups[id] = false;
    } else {
      this.selectedGroups[id] = true;
    }
  }

  editGroup() {
    var n = 0;
    var keys = Object.keys(this.selectedGroups);

    for (var i = 0; i < keys.length; i++) {
      if (this.selectedGroups[keys[i]]) {        
        n++;
      }
    }
    
    if (n == 0 || n > 1) {
      this.toastrService.error('Please select one row', 'Error!!', {"positionClass": "toast-bottom-right"});
      return;
    }

    var selGroup;
    for (var i = 0; i < this.groups.length; i++) {
      if (this.selectedGroups[this.groups[i]._id]) {
        selGroup = this.groups[i];
        break;
      }
    }

    selGroup.isEdit = true;
  }

  deleteGroup() {
    var n = 0;
    var keys = Object.keys(this.selectedGroups);

    for (var i = 0; i < keys.length; i++) {
      if (this.selectedGroups[keys[i]]) {        
        n++;
      }
    }
    
    if (n == 0 || n > 1) {
      this.toastrService.error('Please select one row', 'Error!!', {"positionClass": "toast-bottom-right"});
      return;
    }

    var selGroup;
    for (var i = 0; i < this.groups.length; i++) {
      if (this.selectedGroups[this.groups[i]._id]) {
        selGroup = this.groups[i];
        break;
      }
    }

    let self = this;
    if (selGroup.usagesLength == 0){
      return this.locationService.removeGroup(selGroup).then(
        res => {                

          self.loadGroups();
        },
        err => {
          console.log(err);
          if (err._body != undefined && err._body != null) {
            self.toastrService.error(err._body, 'Error!!', {"positionClass": "toast-bottom-right"});
          } else {
            self.toastrService.error("Failed to create group.", 'Error!!', {"positionClass": "toast-bottom-right"});
          }
        }
      )
    } else {
      this.total = selGroup.usage.length;
      this.data = selGroup.usage; 
      for (let i =0; i < this.data.length; i++){
        this.data[i].route = 'players';
        this.data[i].number = 1;
        this.data[i].type = 'player'
      }
      $("#searchPage").show();
      $("#MainPage").hide();
    }
  }

  searchPageHide(){
    $("#MainPage").show();
    $("#searchPage").hide();
  }

  routeItem(itemName: String){
      this.router.navigate(['customer/home', { outlets: { popup: [itemName] } }]);
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
    $('#categoryTable').tableExport({type:'pdf',escape:'false', tableName:'groups'});
  }

  exportToExcel() {
    $('#categoryTable').tableExport({type:'excel',escape:'false', tableName:'groups'});
  }

}
