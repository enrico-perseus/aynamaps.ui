import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../../components/auth/auth.service";
import {CustomerService} from "../../../components/auth/customer.service";
import {Ng2PaginationModule} from 'ng2-pagination';
import { ToastrService } from 'ngx-toastr';
import {environment} from '../../../environments/environment';


declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  authService;
  router;
  customerService;
  toastrService;

  basePath = environment.basePath;

  customers = [];
  selectedCustomer = [];
  key:string = 'account_name';
  reverse: boolean = false;
  isSearchMode: boolean = false;
  filter;
  
  p = 1;

  constructor(_authService: AuthService, 
              _router: Router, 
              _customerService: CustomerService,
              _toastrService: ToastrService) {
    this.authService = _authService;
    this.router = _router;
    this.customerService = _customerService;
    this.toastrService = _toastrService;
  }

  ngOnInit() {    
    this.getCustomers();

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

  sort(key) {
    this.key = key;
    this.reverse = !this.reverse;
  }

  getCustomers() {
    let self = this;
    this.customerService.query({}).then(
      res => {                
        this.customers = res.json();
        console.log(this.customers)
      },
      err => {        
        self.toastrService.error('Failed to get customer list.', 'Error!!', {"positionClass": "toast-bottom-right"});
      }
    )
  }

  showSearchbar() {
    this.isSearchMode = true;
    alert($('.search-input'));
    $('.search-input').focus();
  }

  hideSearchbar() {
    this.isSearchMode = false;
  }

  selectCustomer(customer) {
    
    customer.selected = !customer.selected;
    if (customer.selected) {
      this.selectedCustomer.push({_id: customer._id});
    } else {
      this.selectedCustomer = this.selectedCustomer.filter(item => item._id != customer._id);
    }
  }

  addCustomer() {
    this.router.navigate(['admin/add-customer/']);
  }

  goToLanguage(){
    this.router.navigate(['admin/language/']);
  }

  editCustomer() {
    if (this.selectedCustomer.length == 1)
      this.router.navigate(['admin/edit-customer/' + this.selectedCustomer[0]._id]);
  }

  exportDb() {
    //window.location.href = this.basePath + '/api/customers/export';
    this.customerService.exportDB().then(
      res => {           
        console.log(res);
      },
      err => {        
        console.log(err);
      }
    )
  }

  importDb() {

  }

  exportToPDF() {
    $('#CustomerListAll').tableExport({type:'pdf',escape:'false', tableName:'customers'});
  }

  exportToExcel() {
    $('#CustomerListAll').tableExport({type:'excel',escape:'false', tableName:'customers'});
  }

  openMenu() {
    var x = document.getElementById("langNav");    
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
  }
}
