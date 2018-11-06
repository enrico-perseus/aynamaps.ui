import { Component, OnInit } from '@angular/core';
import {CustomerService} from "../../../../components/auth/customer.service";
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs/Rx';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-customer-common-chart-block',
  templateUrl: './customer-common-chart-block.component.html',
  styleUrls: ['./customer-common-chart-block.component.css']
})
export class CustomerCommonChartBlockComponent implements OnInit {

  dbConnected = 'Connected';
  commonData = {
    accountCount: Math.floor(Math.random() * 255) + 1,
    licenseCount: Math.floor(Math.random() * 255) + 1,
    storageCount: Math.floor(Math.random() * 255) + 1,
    kioskCount: Math.floor(Math.random() * 255) + 1,
    totallocations: Math.floor(Math.random() * 255) + 1,
    totalkosks: Math.floor(Math.random() * 255) + 1
  };  

  customerService: CustomerService;
  toastrService: ToastrService;
  subscription: Subscription;

  constructor(private _customerService: CustomerService,
              private _toastrService: ToastrService) {
      this.customerService = _customerService;
      this.toastrService = _toastrService;
  }

  ngOnInit() {
    this.get_common_data();
    this.checkConnectionTimer();
  }

  get_common_data() {
    // Todo: get real data using real api
    let self = this;    
    this.customerService.getTimeslots().then(
      res => {                
        var customers = res.json();
        self.loadGraph(customers.length, 2, 4);
      },
      err => {
        self.toastrService.error('Failed to get chart information.', 'Error!!', {"positionClass": "toast-bottom-right"});        
      }
    )
  }

  loadGraph(cutomerCount, k1, k2){
      $('#demo-pie-1').pieChart({
          barColor: '#ffd400',
          trackColor: '#545454',
          lineCap: 'butt',
          lineWidth: 20,
          rotate: 0,
          width: 120,
          height:120,
          onStep: function (from, to, percent) {
              $(this.element).find('.pie-value').text(Math.round(cutomerCount) + '');
          }
      });

      $('#demo-pie-2').pieChart({
          barColor: '#f99d1c',
          trackColor: '#555555',
          lineCap: 'butt',
          lineWidth: 20,
          rotate: 0,
          width: 120,
          height:120,
          onStep: function (from, to, percent) {
              $(this.element).find('.pie-value').text(Math.round(cutomerCount) + '');
          }
      });

      $('#demo-pie-3').pieChart({
          barColor: '#f26631',
          trackColor: '#555555',
          lineCap: 'butt',
          lineWidth: 20,
          rotate: 0,
          width: 120,
          height:120,
          onStep: function (from, to, percent) {
              $(this.element).find('.pie-value').text(Math.round(percent) + '');
          }
      });
      
      $('#demo-pie-4').pieChart({
          barColor: '#00bee7',
          trackColor: '#555555',
          lineCap: 'butt',
          lineWidth: 20,
          rotate: 0,
          width: 120,
          height:120,
          onStep: function (from, to, percent) {
              $(this.element).find('.pie-value').text(Math.round(k1 + k2) + '');
          }
      });
      
      $('#demo-pie-5').pieChart({
          barColor: '#f99d1c',
          trackColor: '#555555',
          lineCap: 'butt',
          lineWidth: 20,
          rotate: 0,
          width: 120,
          height:120,
          onStep: function (from, to, percent) {
              $(this.element).find('.pie-value').text(Math.round(percent) + '');
          }
      });
      
      var chart = $('#demo-pie-6').pieChart({
          barColor: '#00ff00',
          trackColor: '#555555',
          lineCap: 'butt',
          lineWidth: 20,
          rotate: 0,
          width: 120,
          height:120,
          onStep: function (from, to, percent) {
              //$(this.element).find('.pie-value').text(this.dbConnected);
          }
      });

      console.log();
  }

  checkConnectionTimer() {
    let timer = Observable.timer(1000, 2000);
    this.subscription = timer.subscribe((location) => {
      this.checkConnection();
    });
  }

  checkConnection() {    
    this.customerService.checkConnection().then(
      res => {                
        this.dbConnected = 'Connected';
        if ($('#demo-pie-6').data('pieChart')) {
          $('#demo-pie-6').data('pieChart').options.barColor = '#00ff00';
        }
      },
      err => {                
        if ($('#demo-pie-6').data('pieChart')) {
          $('#demo-pie-6').data('pieChart').options.barColor = '#ff0000';
        }
        this.dbConnected = 'Disconnected';
      }
    )    
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
