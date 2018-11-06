import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }   from '@angular/forms';
import {
  DxDataGridModule,
  DxFormModule,
  DxDateBoxModule,
  DxTemplateModule,
  DxChartModule,
  DxPieChartModule
} from 'devextreme-angular';

import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { TagsInputModule } from 'ngx-tags-input/dist';
import { QuillEditorModule } from 'ngx-quill-editor'
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ToastrModule } from 'ngx-toastr';
import { ModalDialogModule } from 'ngx-modal-dialog';

import { DxCheckBoxModule } from 'devextreme-angular';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

import { CustomerRoutingModule } from './customer-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { CustomerCommonChartBlockComponent } from './components/customer-common-chart-block/customer-common-chart-block.component';
import { CustomerNavbarComponent } from './components/customer-navbar/customer-navbar.component';

import { FloorsmapComponent } from './floorsmap/floorsmap.component';
import { AddFloorsmapComponent } from './floorsmap/add-floorsmap/add-floorsmap.component';
import { EditFloorsmapComponent } from './floorsmap/edit-floorsmap/edit-floorsmap.component';

import { PointofinterestComponent } from './locations/pointofinterest/pointofinterest/pointofinterest.component';
import { AddPoiComponent } from './locations/pointofinterest/add-poi/add-poi.component';
import { EditPoiComponent } from './locations/pointofinterest/edit-poi/edit-poi.component';

import { FacilitiesComponent } from './locations/facilities/facilities.component';
import { AddFacilitiesComponent } from './locations/facilities/add-facilities/add-facilities.component';
import { EditFacilitiesComponent } from './locations/facilities/edit-facilities/edit-facilities.component';

import { DestinationsComponent } from './locations/destinations/destinations.component';
import { AddDestinationsComponent } from './locations/destinations/add-destinations/add-destinations.component';
import { EditDestinationsComponent } from './locations/destinations/edit-destinations/edit-destinations.component';

import { FlooraccessComponent } from './locations/flooraccess/flooraccess.component';
import { AddFlooraccessComponent } from './locations/flooraccess/add-flooraccess/add-flooraccess.component';
import { EditFlooraccessComponent } from './locations/flooraccess/edit-flooraccess/edit-flooraccess.component';


import { EmergenciesComponent } from './locations/emergencies/emergencies.component';
import { AddEmergenciesComponent } from './locations/emergencies/add-emergencies/add-emergencies.component';
import { EditEmergenciesComponent } from './locations/emergencies/edit-emergencies/edit-emergencies.component';

import { CategoriesComponent } from './locations/categories/categories.component';
import { CategoryItemComponent } from './locations/categories/category-item/category-item.component';

import { AynaroutesComponent } from './locations/aynaroutes/aynaroutes.component';
import { PlayersComponent } from './kiosks/players/players.component';
import { AddPlayersComponent} from './kiosks/players/add-players/add-players.component';
import { EditPlayersComponent } from './kiosks/players/edit-players/edit-players.component';

import { GroupsComponent } from './kiosks/groups/groups.component';
import { GroupItemComponent } from './kiosks/groups/group-item/group-item.component';

import { BeaconsComponent } from './beacons/beacons.component';
import { EditBeaconsComponent } from './beacons/edit-beacons/edit-beacons.component';

import { NetworkMonitoringComponent } from './reports/network-monitoring/network-monitoring.component';
import { UserActivityComponent } from './reports/user-activity/user-activity.component';
import { TopSegmentsComponent } from './reports/top-segments/top-segments.component';
import { KiosksPerformanceComponent } from './reports/kiosks-performance/kiosks-performance.component';
import { DestinationPerformanceComponent } from './reports/destination-performance/destination-performance.component';
import { LocationsPerformanceComponent } from './reports/locations-performance/locations-performance.component';
import { UsersComponent } from './system_management/users/users.component';
import { RolesComponent } from './system_management/roles/roles.component';
import { TimeslotsComponent } from './system_management/timeslots/timeslots.component';
import { SettingsComponent } from './system_management/settings/settings.component';
import { BuildingsComponent } from './buildings/buildings/buildings.component';
import { CustomerComponent } from './customer.component';
import { EditBuildingComponent } from './buildings/edit-building/edit-building.component';

import { NewTimeslotsComponent } from './system_management/timeslots/new-timeslots/new-timeslots.component';
import { EditTimeslotsComponent } from './system_management/timeslots/edit-timeslots/edit-timeslots.component';
import { NewRolesComponent } from './system_management/roles/new-roles/new-roles.component';
import { EditRolesComponent } from './system_management/roles/edit-roles/edit-roles.component';
import { NewUsersComponent } from './system_management/users/new-users/new-users.component';
import { EditUsersComponent } from './system_management/users/edit-users/edit-users.component';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';

import { FilterPipe } from './filter.pipe';
import { OrderByPipe } from './sort.pipe';
import {OrderNByPipe} from "./sort_number.pipe";

@NgModule({
  imports: [
    CommonModule,    
    CustomerRoutingModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    Ng2OrderModule,
    FormsModule,
    DxDataGridModule,
    DxFormModule,
    DxDateBoxModule,
    DxTemplateModule,
    DxChartModule,
    DxPieChartModule,    
    QuillEditorModule,
    MatSlideToggleModule,
    DxCheckBoxModule,
    OwlDateTimeModule, 
    OwlNativeDateTimeModule,
    ModalDialogModule.forRoot(),
    TagsInputModule.forRoot(),
    MultiselectDropdownModule,
    ToastrModule.forRoot()
 
  ],
  declarations: [
    DashboardComponent,
    MyAccountComponent,
    CustomerNavbarComponent,
    CustomerCommonChartBlockComponent,

    BuildingsComponent,
    EditBuildingComponent,
    
    FloorsmapComponent,
    AddFloorsmapComponent,
    EditFloorsmapComponent,

    PointofinterestComponent,
    AddPoiComponent, 
    EditPoiComponent,
     
    FacilitiesComponent,
    AddFacilitiesComponent,
    EditFacilitiesComponent,

    DestinationsComponent,
    AddDestinationsComponent,
    EditDestinationsComponent,

    FlooraccessComponent,
    AddFlooraccessComponent,
    EditFlooraccessComponent,
    
    EmergenciesComponent,
    AddEmergenciesComponent,
    EditEmergenciesComponent,
    
    CategoriesComponent,
    CategoryItemComponent,

    AynaroutesComponent,

    PlayersComponent,
    AddPlayersComponent,
    EditPlayersComponent,

    GroupsComponent,
    GroupItemComponent,
    
    BeaconsComponent,
    EditBeaconsComponent,
     
    NetworkMonitoringComponent, 
    UserActivityComponent, 
    TopSegmentsComponent, 
    KiosksPerformanceComponent, 
    DestinationPerformanceComponent, 
    LocationsPerformanceComponent, 
    UsersComponent, 
    RolesComponent, 
    TimeslotsComponent, 
    SettingsComponent, 
    CustomerComponent, 
 
    NewTimeslotsComponent, 
    EditTimeslotsComponent,
    NewRolesComponent, 
    EditRolesComponent,
    NewUsersComponent, 
    EditUsersComponent,

    FilterPipe,
    OrderByPipe,
      OrderNByPipe
  ]
})
export class CustomerModule { }
