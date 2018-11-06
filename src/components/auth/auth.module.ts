'use strict';

import { NgModule } from '@angular/core';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { CustomerService } from './customer.service';
import { AuthGuard } from './auth-guard.service';
import { AdminGuard } from './admin-guard.service';
import { LanguageService } from './language.service';
import { LocationService } from './location.service';

@NgModule({
    providers: [
        AuthService,
        UserService,
        CustomerService,
        LanguageService,
        LocationService,
        AuthGuard,
        AdminGuard
    ]
})
export class AuthModule {}
