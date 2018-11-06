import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from "../components/auth/admin-guard.service";
import { CustomerComponent } from './customer/customer.component';

const routes: Routes = [
  { path: 'auth', 
    loadChildren: 'app/auth/auth.module#AuthModule',
    runGuardsAndResolvers: 'always'
  },
  { path: 'admin', 
    loadChildren: 'app/admin/admin.module#AdminModule', 
    canActivate: [AdminGuard],
    runGuardsAndResolvers: 'always'
  },
  { path: 'customer', 
    loadChildren: 'app/customer/customer.module#CustomerModule',
    runGuardsAndResolvers: 'always'
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
    runGuardsAndResolvers: 'always'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
