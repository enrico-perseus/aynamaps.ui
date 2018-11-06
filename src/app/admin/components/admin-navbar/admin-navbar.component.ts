import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../../components/auth/auth.service";
import {Router} from "@angular/router";

import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.css']
})

export class AdminNavbarComponent implements OnInit {

  isCollapsed = true;
  menu = [{
    title: 'Home',
    'link': '/home',
  }];
  Router;
  isAdmin;
  isLoggedIn;
  currentUser = {
    name: '',
    avatar: ''
  };
  basePath = environment.basePath;
  AuthService;

  static parameters = [AuthService, Router];
  constructor(private authService: AuthService, private router: Router) {
    this.AuthService = authService;

    this.Router = router;

    this.reset();

    this.AuthService.currentUserChanged.subscribe(user => {
      this.currentUser = user;
      this.reset();
    });
  }

  ngOnInit(): void {
  }

  reset() {
    this.AuthService.getCurrentUser().then(user => {
      this.currentUser = user;
    });
  }

  logout() {
    let promise = this.AuthService.logout();
    //this.Router.naviate['auth'];
    this.Router.navigate(['/']);
    return promise;
  }
}
