import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {AddCustomerComponent} from "./add-customer/add-customer.component";
import {EditCustomerComponent} from "./edit-customer/edit-customer.component";
import {MyAccountComponent} from "./my-account/my-account.component";
import {LanguageComponent} from './language/language/language.component';
import { AddLanguageComponent } from './language/add-language/add-language.component';


const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'add-customer',
    component: AddCustomerComponent
  },
  {
    path: 'edit-customer/:id',
    component: EditCustomerComponent
  },
  {
    path: 'my-account',
    component: MyAccountComponent
  },
  {
    path: 'language',
    component: LanguageComponent
  },
  {
    path: 'add-language',
    component: AddLanguageComponent
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
