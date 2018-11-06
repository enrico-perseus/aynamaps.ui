import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from "@angular/forms";
import {
  DxDataGridModule,
  DxFormModule,
  DxDateBoxModule,
  DxTemplateModule
} from 'devextreme-angular';
import {NgxPaginationModule} from 'ngx-pagination';
import {Ng2SearchPipeModule} from 'ng2-search-filter';
import {Ng2OrderModule} from 'ng2-order-pipe';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { EditCustomerComponent } from './edit-customer/edit-customer.component';

import { AdminNavbarComponent } from './components/admin-navbar/admin-navbar.component';
import { AdminCommonChartBlockComponent } from './components/admin-common-chart-block/admin-common-chart-block.component';
import { ToastrModule } from 'ngx-toastr';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AngularFilePickerModule } from 'angular-file-picker';
import { LanguageComponent } from './language/language/language.component';
import { AddLanguageComponent } from './language/add-language/add-language.component';
import { EditLanguageComponent } from './language/edit-language/edit-language.component'
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AdminRoutingModule,
    DxDataGridModule,
    DxFormModule,
    DxDateBoxModule,
    DxTemplateModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    Ng2OrderModule,
    MatSlideToggleModule,
    AngularFilePickerModule,
    MultiselectDropdownModule,
    ToastrModule.forRoot()
  ],
  declarations: [
    DashboardComponent,
    MyAccountComponent,
    AddCustomerComponent,
    EditCustomerComponent,
    AdminNavbarComponent,
    AdminCommonChartBlockComponent,
    LanguageComponent,
    AddLanguageComponent,
    EditLanguageComponent
  ]
})
export class AdminModule { }
