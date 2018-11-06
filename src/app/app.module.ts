import { BrowserModule } from '@angular/platform-browser';
import {Injectable, NgModule, Provider} from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import {DirectivesModule} from "../components/directives.module";
import {AuthConfig, AuthHttp} from "angular2-jwt";
import {APP_BASE_HREF} from "@angular/common";
import {Http, HttpModule} from "@angular/http";

import {NgxPaginationModule} from 'ngx-pagination';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {
  DxPieChartModule,
  DxDataGridModule,
  DxTemplateModule
} from 'devextreme-angular';
import {Select2Module} from "ng2-select2";
import { HttpClientModule } from '@angular/common/http';

export function getAuthHttp(http) {
  return new AuthHttp(new AuthConfig({
    noJwtError: true,
    headerPrefix: 'Bearer',
    globalHeaders: [{'Accept': 'application/json'}],
    tokenGetter: (() => localStorage.getItem('id_token')),
  }), http);
}

let providers: Provider[] = [
  { provide: APP_BASE_HREF, useValue: '/' },
  {
    provide: AuthHttp,
    useFactory: getAuthHttp,
    deps: [Http]
  }];

@NgModule({
  providers,
  declarations: [
    AppComponent,
  ],
  imports: [
    HttpModule,
    HttpClientModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    DirectivesModule,
    Select2Module,
    // dev express template modules
    DxPieChartModule,
    DxDataGridModule,
    DxTemplateModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
