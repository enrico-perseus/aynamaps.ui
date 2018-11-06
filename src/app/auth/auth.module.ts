import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import {FormsModule} from "@angular/forms";
import {
  DxDataGridModule,
  DxFormModule,
  DxDateBoxModule,
  DxTemplateModule
} from 'devextreme-angular';
import { ForgotpassComponent } from './forgotpass/forgotpass.component';
import { ToastrModule } from 'ngx-toastr';
import { RecaptchaModule } from 'angular-google-recaptcha';

@NgModule({
  imports: [
    FormsModule,
    DxDataGridModule,
    DxFormModule,
    DxDateBoxModule,
    DxTemplateModule,
    CommonModule,
    AuthRoutingModule,
    RecaptchaModule.forRoot({
      siteKey: '6LeoJ0MUAAAAAMo5K_pyroLDqoL_Vwo13Zju61wx',
      //siteKey: '6LdPpFsUAAAAAGy7VtwMlhW17NORd056_l7PFWpA'
    }),
    ToastrModule.forRoot()
  ],
  declarations: [LoginComponent, ForgotpassComponent]
})
export class AuthModule { }
