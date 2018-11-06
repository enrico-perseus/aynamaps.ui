import { Component, OnInit } from '@angular/core';
import { SlideInOutAnimation } from '../shared/animations';
import { AuthService } from '../../components/auth/auth.service';
import { CustomerService } from '../../components/auth/customer.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
  animations: [SlideInOutAnimation]
})
export class CustomerComponent implements OnInit {

  animationLocation = 'out';
  animationKiosk = 'out';
  animationReport = 'out';
  animationManage = 'out';
  currentUser = {
    avatar: ''
  };
  basePath = environment.basePath;

  UserImage = 'assets/images/users/avatar-1.png';

  router;
  authService: AuthService;
  customerService : CustomerService;
  SiteSearchText: '';
  data = [];
  total = 0;

  Has = 0;


  constructor(_router: Router,
              private _authService: AuthService,
              private _customerService: CustomerService ) {
    this.router = _router;
    this.router.events.subscribe((val) => {
      $("body div.viewport").remove();
    });
    this.authService = _authService;
    this.customerService = _customerService;
    this.reset();

    this.authService.currentUserChanged.subscribe(user => {
      this.currentUser = user;
      console.log(this.currentUser);
      this.reset();
    });
  }

  ngOnInit() {
    let k = 0;
    $("#myelement").click(function () {
      $("#another-element").toggleClass("main2");
      $(".right-side-area").toggleClass("main");
      $(window).resize();
       if($(".right-side-area").hasClass('main') && k==0){
          setTimeout(function(){
              var chart = $("#chartMiddleGraph").dxChart("instance");
              var renderOptions = { force: true };
              chart.render(renderOptions);
              console.log('having mai class')
          },500)
          k++;
      }else{
              console.log('having main2 class')
              setTimeout(function(){
              var chart = $("#chartMiddleGraph").dxChart("instance");
              var renderOptions = { force: true };
              chart.render(renderOptions);
              console.log('having main222 class')
          },500)
      }
  });

  }

  reset() {
    this.authService.getCurrentUser().then(user => {
      this.currentUser = user;
      console.log(this.currentUser);
    });
  }

  SiteSearch(){
    let self = this;
    if (this.SiteSearchText != '') {
      this.customerService.searchbyName(this.SiteSearchText).then(
        res =>{
          self.data = res.json();
          self.total = 0;
          for (let i = 0; i < self.data.length ; i++){
              self.total = self.total + self.data[i].number;
          }
          if(self.SiteSearchText !=''){
              $("#searchResult").show();
              $("#MainDiv").hide();
          }else{
              $("#searchResult").hide();
              $("#MainDiv").show();
          }
          console.log(JSON.stringify(self.data));
      },
        err =>{
          $("#searchResult").hide();
          $("#MainDiv").show();
        }
      )
    } else {
        $("#searchResult").hide();
        $("#MainDiv").show();
    }
  }

  toggleShowMenu(divName: string) {
      if (divName === 'location') {
        this.animationLocation = this.animationLocation === 'out' ? 'in' : 'out';
        this.animationKiosk = 'out';
        this.animationReport = 'out';
        this.animationManage = 'out';
      } else if (divName == 'kiosk') {
        this.animationLocation = 'out';
        this.animationKiosk = this.animationKiosk === 'out' ? 'in' : 'out';
        this.animationReport = 'out';
        this.animationManage = 'out';
      } else if (divName == 'report') {
        this.animationKiosk = 'out';
        this.animationLocation = 'out';
        this.animationReport = this.animationReport === 'out' ? 'in' : 'out';
        this.animationManage = 'out';
      } else if (divName == 'management') {
        this.animationKiosk = 'out';
        this.animationReport = 'out';
        this.animationLocation = 'out';
        this.animationManage = this.animationManage === 'out' ? 'in' : 'out';
      } else {
        this.animationKiosk = 'out';
        this.animationReport = 'out';
        this.animationLocation = 'out';
        this.animationManage = 'out';
      }
  }

  routeItem(itemName: String){

    if (this.customerService.savedFlag == false){
        if (!confirm('Do you change route without saving?') == true)
        {
            return;
        }
    }
      $(document).ready(function () {

          window.addEventListener("beforeunload", function(event) {
              //return confirm("Do you really want to close?")
              event.returnValue = confirm("Do you really want to close?");
          });
      })
    this.customerService.savedFlag = true;
    $("#searchResult").hide();
    $("body div.viewport").remove();
    $("#MainDiv").show();

    /* if ($(window).width() > 991) {
      this.router.navigate(['customer/home', { outlets: { popup: [itemName] } }]);
    } else { */
      this.animationLocation = 'out';
      this.animationKiosk = 'out';
      this.animationReport = 'out';
      this.animationManage = 'out';
      this.router.navigate(['customer/home', { outlets: { popup: [itemName] } }]);
    /* } */
  }

  logout() {
    let promise = this.authService.logout().then(res => {
      document.location.href='/';
      //this.router.navigateByUrl('/');
    });
    //return promise;
}

  navigateToBuildings() {
    this.router.navigate([
       '', { outlets: { main: ['buildings'] } }
    ])
  }

}
