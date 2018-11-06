import { Component, OnInit, ContentChildren, QueryList } from '@angular/core';
import { AuthService } from '../../../../components/auth/auth.service';
import { LocationService } from '../../../../components/auth/location.service';
import { ToastrService } from 'ngx-toastr';
import { CategoryItemComponent } from './category-item/category-item.component';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  currentUser = {};
  selectedCategories = {};

  authService: AuthService;  
  locationService: LocationService;
  toastrService: any
  
  filter;
  
  categories = [];
  data = [];
  total = 0;

  constructor(private _authService: AuthService,
              private _locationService: LocationService,
              private _toastrService: ToastrService) { 
    this.authService = _authService;
    this.locationService = _locationService;
    this.toastrService = _toastrService;
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
      self.loadCategories();
    });
  }

  loadCategories() {
    let self = this;
    this.locationService.getCategory().toPromise()
    .then(
      categories => {                
        self.selectedCategories = [];        
        self.categories = categories;
      },
      err => {
        console.log(err);        
      }
    )
  }

  addCategory() {
    this.categories.push({
      name: '',
      _id: '',
      createdBy: {
        email: this.currentUser['email'],
        _id: this.currentUser['_id']
      },
      status: 'Enable',
      isEdit: true
    });
  }

  onCategoryAdded(category) {    
    this.loadCategories();
  } 

  selectCategory(id) {
    if (this.selectedCategories[id]) {
      this.selectedCategories[id] = false;
    } else {
      this.selectedCategories[id] = true;
    }
  }

  editCategory() {
    var n = 0;
    var keys = Object.keys(this.selectedCategories);

    for (var i = 0; i < keys.length; i++) {
      if (this.selectedCategories[keys[i]]) {        
        n++;
      }
    }
    
    if (n == 0 || n > 1) {
      this.toastrService.error('Please select one row', 'Error!!', {"positionClass": "toast-bottom-right"});
      return;
    }

    var selCategory;
    for (var i = 0; i < this.categories.length; i++) {
      if (this.selectedCategories[this.categories[i]._id]) {
        selCategory = this.categories[i];
        break;
      }
    }

    selCategory.isEdit = true;
  }

  deleteCategory() {
    var n = 0;
    var keys = Object.keys(this.selectedCategories);

    for (var i = 0; i < keys.length; i++) {
      if (this.selectedCategories[keys[i]]) {        
        n++;
      }
    }
    
    if (n != 1) {
      this.toastrService.error('Please select one row', 'Error!!', {"positionClass": "toast-bottom-right"});
      return;
    }

    var selCategory;
    for (var i = 0; i < this.categories.length; i++) {
      if (this.selectedCategories[this.categories[i]._id]) {
        selCategory = this.categories[i];
        break;
      }
    }

    let self = this;
    this.locationService.getUsingbyCategory_id(selCategory).then(
      res => {                
        self.data = res.json();
        console.log(self.data);
        if (self.data.length == 0){
           return self.locationService.removeCategory(selCategory).then(
            res => {
              self.loadCategories();
            },
            err => {
              console.log(err);
              if (err._body != undefined && err._body != null) {
                self.toastrService.error(err._body, 'Error!!', {"positionClass": "toast-bottom-right"});
              } else {
                self.toastrService.error("Failed to create category.", 'Error!!', {"positionClass": "toast-bottom-right"});
              }
            }
          )
        } else {
          self.total = 0;
          for (let i = 0; i < self.data.length ; i++){
            self.total = self.total + self.data[i].position.length;
          }
          $("#searchPage").show();
          $("#mainPage").hide();
        }          
    },
    err => {        
        self.toastrService.error('Failed to get using list.', 'Error!!', {"positionClass": "toast-bottom-right"});
    }
    )
 }

 searchPageHide(){
  $("#mainPage").show();
  $("#searchPage").hide();
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
    $('#categoryTable').tableExport({type:'pdf',escape:'false', tableName:'categories'});
  }

  exportToExcel() {
    $('#categoryTable').tableExport({type:'excel',escape:'false', tableName:'categories'});
  }

}
