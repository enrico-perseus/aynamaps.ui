import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable()
export class AdminGuard implements CanActivate {
    authService;

    static parameters = [AuthService];
    constructor(authService: AuthService) {
        this.authService = authService;
    }

    canActivate() {
        let loggedIn = this.authService.isLoggedIn();
        let isCustomer = this.authService.isCustomer();
        return loggedIn && !isCustomer;
    }
}
