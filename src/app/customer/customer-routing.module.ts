import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { BuildingsComponent } from './buildings/buildings/buildings.component';
import { EditBuildingComponent } from './buildings/edit-building/edit-building.component';

import { CustomerComponent } from './customer.component';

import { FloorsmapComponent } from './floorsmap/floorsmap.component';
import { AddFloorsmapComponent } from './floorsmap/add-floorsmap/add-floorsmap.component';
import { EditFloorsmapComponent } from './floorsmap/edit-floorsmap/edit-floorsmap.component';

import { PointofinterestComponent } from './locations/pointofinterest/pointofinterest/pointofinterest.component';
import { AddPoiComponent } from './locations/pointofinterest/add-poi/add-poi.component';
import { EditPoiComponent } from './locations/pointofinterest/edit-poi/edit-poi.component';

import { FacilitiesComponent } from './locations/facilities/facilities.component';
import { AddFacilitiesComponent } from './locations/facilities/add-facilities/add-facilities.component';
import { EditFacilitiesComponent } from './locations/facilities/edit-facilities/edit-facilities.component'

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
import { AynaroutesComponent } from './locations/aynaroutes/aynaroutes.component';
import { PlayersComponent } from './kiosks/players/players.component';
import { AddPlayersComponent } from './kiosks/players/add-players/add-players.component';
import { EditPlayersComponent} from './kiosks/players/edit-players/edit-players.component';

import { GroupsComponent } from './kiosks/groups/groups.component';
import { BeaconsComponent } from './beacons/beacons.component';
import { EditBeaconsComponent } from './beacons/edit-beacons/edit-beacons.component';

import { NetworkMonitoringComponent } from './reports/network-monitoring/network-monitoring.component';
import { UserActivityComponent } from './reports/user-activity/user-activity.component';
import { TopSegmentsComponent } from './reports/top-segments/top-segments.component';
import { LocationsPerformanceComponent } from './reports/locations-performance/locations-performance.component';
import { KiosksPerformanceComponent } from './reports/kiosks-performance/kiosks-performance.component';
import { DestinationPerformanceComponent } from './reports/destination-performance/destination-performance.component';
import { UsersComponent } from './system_management/users/users.component';
import { RolesComponent } from './system_management/roles/roles.component';
import { TimeslotsComponent } from './system_management/timeslots/timeslots.component';
import { SettingsComponent } from './system_management/settings/settings.component';


import { NewTimeslotsComponent } from './system_management/timeslots/new-timeslots/new-timeslots.component';
import { EditTimeslotsComponent } from './system_management/timeslots/edit-timeslots/edit-timeslots.component';
import { NewRolesComponent } from './system_management/roles/new-roles/new-roles.component';
import { EditRolesComponent } from './system_management/roles/edit-roles/edit-roles.component';
import { NewUsersComponent } from './system_management/users/new-users/new-users.component';
import { EditUsersComponent } from './system_management/users/edit-users/edit-users.component';

const routes: Routes = [
{
    path: 'home',
    component: CustomerComponent,
    children: [
      { path: '',                       component: DashboardComponent,              outlet: 'popup'},
      { path: 'dashboard',              component: DashboardComponent,              outlet: 'popup'},
      { path: 'my-account',             component: MyAccountComponent,              outlet: 'popup'},
      
      { path: 'buildings',              component: BuildingsComponent,              outlet: 'popup'},
      { path: 'editbuildings/:id',      component: EditBuildingComponent,           outlet: 'popup'},
      
      { path: 'floormaps',              component: FloorsmapComponent,              outlet: 'popup'},
      { path: 'addfloormaps/:building_id/:building_floors', component: AddFloorsmapComponent,           outlet: 'popup'},
      { path: 'editfloormaps/:id/:building_floors', component: EditFloorsmapComponent,          outlet: 'popup'},
      
      { path: 'pointsofinterest',       component: PointofinterestComponent,        outlet: 'popup'},
      { path: 'addpoi/:building_id/:floor_id', component: AddPoiComponent,                 outlet: 'popup'},
      { path: 'editpoi/:id',            component: EditPoiComponent,                outlet: 'popup'},
      
      { path: 'facilities',             component: FacilitiesComponent,             outlet: 'popup'},
      { path: 'addfacilities/:building_id/:floor_id', component: AddFacilitiesComponent,          outlet: 'popup'},
      { path: 'editfacilities/:id',     component: EditFacilitiesComponent,         outlet: 'popup'},

      { path: 'destinations',           component: DestinationsComponent,           outlet: 'popup'},
      { path: 'adddestinations/:building_id/:floor_id', component: AddDestinationsComponent,        outlet: 'popup'},
      { path: 'editdestinations/:id',   component: EditDestinationsComponent,       outlet: 'popup'},

      { path: 'flooraccess',            component: FlooraccessComponent,            outlet: 'popup'},
      { path: 'addflooraccess/:building_id', component: AddFlooraccessComponent,         outlet: 'popup'},
      { path: 'editflooraccess/:id',    component: EditFlooraccessComponent,        outlet: 'popup'},

      { path: 'emergencies',            component: EmergenciesComponent,            outlet: 'popup'},
      { path: 'addemergencies/:building_id/:floor_id', component: AddEmergenciesComponent,         outlet: 'popup'},
      { path: 'editemergencies/:id',    component: EditEmergenciesComponent,        outlet: 'popup'},

      { path: 'categories',             component: CategoriesComponent,             outlet: 'popup'},
      { path: 'aynaroutes',             component: AynaroutesComponent,             outlet: 'popup'},
      { path: 'players',                component: PlayersComponent,                outlet: 'popup'},
      { path: 'addplayers/:building_id/:floor_id', component: AddPlayersComponent,             outlet: 'popup'},
      { path: 'editplayers/:id',        component: EditPlayersComponent,            outlet: 'popup'},

      { path: 'groups',                 component: GroupsComponent,                 outlet: 'popup'},
      { path: 'beacons',                component: BeaconsComponent,                outlet: 'popup'},
      { path: 'editbeacons/:building_id/:floor_id/:beacon_id',        component: EditBeaconsComponent,            outlet: 'popup'},

      { path: 'networkmonitoring',      component: NetworkMonitoringComponent,      outlet: 'popup'},
      { path: 'useractivity',           component: UserActivityComponent,           outlet: 'popup'},
      { path: 'topsegments',            component: TopSegmentsComponent,            outlet: 'popup'},
      { path: 'kioskperformance',       component: KiosksPerformanceComponent,      outlet: 'popup'},
      { path: 'destinationperformance', component: DestinationPerformanceComponent, outlet: 'popup'},
      { path: 'locationsperformance',   component: LocationsPerformanceComponent,   outlet: 'popup'},
      { path: 'users',                  component: UsersComponent,                  outlet: 'popup'},
      { path: 'roles',                  component: RolesComponent,                  outlet: 'popup'},
      { path: 'timeslots',              component: TimeslotsComponent,              outlet: 'popup'},
      { path: 'newtimeslots',           component: NewTimeslotsComponent,           outlet: 'popup'},
      { path: 'edittimeslots/:id',      component: EditTimeslotsComponent,          outlet: 'popup'},
      { path: 'newroles',               component: NewRolesComponent,               outlet: 'popup'},
      { path: 'editroles/:id',          component: EditRolesComponent,              outlet: 'popup'},
      { path: 'newusers',               component: NewUsersComponent,               outlet: 'popup'},
      { path: 'editusers/:id',          component: EditUsersComponent,              outlet: 'popup'},
      { path: 'settings',               component: SettingsComponent,               outlet: 'popup'}
    ]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { 
  
}
