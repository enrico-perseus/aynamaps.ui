'use strict';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import {environment} from "../../environments/environment";

// @flow
type UserType = {
    // TODO: use Mongoose model
    id?: string;
    _id?: string;
    name?: string;
    email?: string;
};

function handleError(err) {
    return Observable.throw(err.json().error || 'Server error');
}

@Injectable()
export class CustomerService {
    AuthHttp;
    basePath = environment.basePath;
    httpClient;
    savedFlag = true;
    static parameters = [AuthHttp];
    constructor(private authHttp: AuthHttp,
                private http: HttpClient) {
       console.log(http);
        this.AuthHttp = authHttp;
        this.httpClient = http;
    }

    getFloorColors(floor_id){
      return this.AuthHttp.get(`${this.basePath}/api/floorcolors/${floor_id}`)
      .map((res: Response) => res.json())
      .catch(handleError);
    }
    createFloorColors(colorData){
      return this.AuthHttp.post(`${this.basePath}/api/floorcolors/`, colorData).toPromise();
    }
    editFloorColors(colorData) {
      return this.AuthHttp.put(`${this.basePath}/api/floorcolors/`, colorData).toPromise();
  }

    getIpAddress(){
        return this.httpClient
            .get('http://freegeoip.net/json/?callback')
            .map(response => response || {})
            .catch(this.handleError);

    }

    private handleError(error: HttpErrorResponse):
        Observable<any>{
            console.log('observable error:', error);

            return Observable.throw(error);
        }

    query() {
        return this.AuthHttp.get(`${this.basePath}/api/customers/`).toPromise();
    }
    get(user: any = {id: 'me'}): Observable<any> {
        console.log("userInfo get api in " + JSON.stringify(user));
        // return this.AuthHttp.get(`${this.basePath}/api/customers/${user.id || user._id}`).toPromise();
        return this.AuthHttp.get(`${this.basePath}/api/customers/${user.id || user._id}`)
        .map((res: Response) => res.json())
        .catch(handleError);
    }
    create(user) {
        return this.AuthHttp.post(`${this.basePath}/api/customers/`, user).toPromise();
    }

    update(user) {
        return this.AuthHttp.put(`${this.basePath}/api/customers/`, user).toPromise();
    }

/*     changePassword(user, name, oldPassword, newPassword, avatarUrl) {
        console.log("enter changePassword api request" + user._id + name + oldPassword + newPassword + avatarUrl);
        return this.AuthHttp.put(`${this.basePath}/api/customers/${user.id || user._id}/password`, {name, oldPassword, newPassword, avatarUrl}).toPromise;
    } */

    changePassword(user, name, oldPassword, newPassword, avatarUrl) {
        return this.AuthHttp.put(`${this.basePath}/api/customers/${user.id || user._id}/password`, {name, oldPassword, newPassword, avatarUrl})
            .map((res: Response) => res.json())
            .catch(handleError);
    }

    forgotPassword(email) {
        return this.AuthHttp.post(`${this.basePath}/api/customers/forgotPassword`, { email })
            .map((res: Response) => res.json())
            .catch(handleError);
    }

/*     changePassword(user, name, oldPassword, newPassword, avatarUrl) {
        console.log("enter changePassword api request" + user._id + name + oldPassword + newPassword + avatarUrl);
        return this.AuthHttp.put(`${this.basePath}/api/customers/${user.id || user._id}/password`, {name, oldPassword, newPassword, avatarUrl})
            .map((res: Response) => res.json())
            .catch(handleError);
    }  */
    remove(user) {
        return this.AuthHttp.delete(`${this.basePath}/api/customers/${user.id || user._id}`)
            .map(() => user)
            .catch(handleError);
    }
    uploadFile(file) {
        let formData: FormData = new FormData();
        formData.append('file', file, file.name);
        return this.AuthHttp.post(`${this.basePath}/api/customers/upload`, formData).toPromise();
    }
    deleteFile(id, filename) {
        return this.AuthHttp.delete(`${this.basePath}/api/customers/${id}/delete/${filename}`).toPromise();
    }
    sendMail(email) {
        return this.AuthHttp.post(`${this.basePath}/api/customers/sendmail`, {email: email}).toPromise();
    }
    checkConnection() {
        return this.AuthHttp.post(`${this.basePath}/api/customers/checkconnection`).toPromise();
    }
    exportDB() {
        return this.AuthHttp.post(`${this.basePath}/api/customers/export`).toPromise();
    }

    getNASetting(user) {
        console.log("userInfo get api in " + JSON.stringify(user));
        // return this.AuthHttp.get(`${this.basePath}/api/customers/${user.id || user._id}`).toPromise();
        return this.AuthHttp.get(`${this.basePath}/api/nASettings/${user.id || user._id}`).toPromise();
    }

    createNASetting(nASetting) {
        return this.AuthHttp.post(`${this.basePath}/api/nASettings/`, nASetting).toPromise();
    }

    updateNASetting(nASetting) {
        return this.AuthHttp.put(`${this.basePath}/api/nASettings/`, nASetting).toPromise();
    }


    createTimeslot(timeslot) {
        return this.AuthHttp.post(`${this.basePath}/api/timeslots/`, timeslot).toPromise();
    }

    editTimeslot(timeslot) {
        console.log("enter edit timeslot api request" + JSON.stringify(timeslot));
        return this.AuthHttp.put(`${this.basePath}/api/timeslots/`, timeslot).toPromise();
    }


    getUsingbyTimeslotName(timeslot_name) {
        return this.AuthHttp.get(`${this.basePath}/api/timeslots/name/${timeslot_name}`).toPromise();
    }

    removeTimeslot(timeslot_id) {
        console.log("enter remove timeslot api request" + timeslot_id);
        return this.AuthHttp.delete(`${this.basePath}/api/timeslots/${timeslot_id}`).toPromise();
    }

    getTimeslots() {
        return this.AuthHttp.get(`${this.basePath}/api/timeslots/`).toPromise();
    }

    getCountries() {
        return this.AuthHttp.get(`${this.basePath}/api/countries/`).toPromise();
    }

    getTimeslotbyId(id) {
        return this.AuthHttp.get(`${this.basePath}/api/timeslots/${id}`).toPromise();
    }

    createRole(roleData) {
        console.log("enter create role api request" + roleData);
        return this.AuthHttp.post(`${this.basePath}/api/roles/`, roleData).toPromise();
    }

    editRole(roleData) {
        console.log("enter remove role api request" + roleData);
        return this.AuthHttp.put(`${this.basePath}/api/roles/`, roleData).toPromise();
    }

    getUsingbyRoleName(role_name) {
        return this.AuthHttp.get(`${this.basePath}/api/roles/name/${role_name}`).toPromise();
    }

    removeRole(role_id) {
        console.log("enter edit role api request" + role_id);
        return this.AuthHttp.delete(`${this.basePath}/api/roles/${role_id}`).toPromise();
    }

    getRoles() {
        return this.AuthHttp.get(`${this.basePath}/api/roles/`).toPromise();
    }

    getRolebyId(id) {
        return this.AuthHttp.get(`${this.basePath}/api/roles/${id}`).toPromise();
    }

    createUser(users_info) {
        console.log("enter create role api request" + users_info);
        return this.AuthHttp.post(`${this.basePath}/api/users_infos/`, users_info).toPromise();
    }

    editUser(users_info) {
        console.log("enter edit role api request" + users_info);
        return this.AuthHttp.put(`${this.basePath}/api/users_infos/`, users_info).toPromise();
    }

    removeUser(users_info_id) {
        console.log("enter remove role api request" + users_info_id);
        return this.AuthHttp.delete(`${this.basePath}/api/users_infos/${users_info_id}`).toPromise();
    }

    getUsers() {
        return this.AuthHttp.get(`${this.basePath}/api/users_infos/`).toPromise();
    }

    getUserbyId(id) {
        return this.AuthHttp.get(`${this.basePath}/api/users_infos/${id}`).toPromise();
    }

    uploadUserFile(file) {
        let formData: FormData = new FormData();
        formData.append('file', file, file.name);
        return this.AuthHttp.post(`${this.basePath}/api/users_infos/upload`, formData).toPromise();
    }
    createBuilding(buildingData) {
        console.log("enter create building api request" + buildingData);
        return this.AuthHttp.post(`${this.basePath}/api/buildings/`, buildingData).toPromise();
    }

    editBuilding(buildingData) {
        console.log("enter edit building api request" + buildingData);
        return this.AuthHttp.put(`${this.basePath}/api/buildings/`, buildingData).toPromise();
    }

    removeBuilding(building_id) {
        console.log("enter remove building api request" + building_id);
        return this.AuthHttp.delete(`${this.basePath}/api/buildings/${building_id}`).toPromise();
    }

    getBuildings() {
        return this.AuthHttp.get(`${this.basePath}/api/buildings/`).toPromise();
    }

    getBuildingbyId(id) {
        return this.AuthHttp.get(`${this.basePath}/api/buildings/${id}`).toPromise();
    }

    uploadBuildingFile(file) {
        console.log("enter upload building file api request");
        let formData: FormData = new FormData();
        formData.append('file', file, file.name);
        return this.AuthHttp.post(`${this.basePath}/api/buildings/upload`, formData).toPromise();
    }

    createFloor(floorData) {
        console.log("enter create floor api request" + floorData);
        return this.AuthHttp.post(`${this.basePath}/api/floors/`, floorData).toPromise();
    }

    editFloor(floorData) {
        console.log("enter edit floor api request" + floorData);
        return this.AuthHttp.put(`${this.basePath}/api/floors/`, floorData).toPromise();
    }

    removeFloor(floor_id) {
        console.log("enter remove floor api request" + floor_id);
        return this.AuthHttp.delete(`${this.basePath}/api/floors/${floor_id}`).toPromise();
    }

    getFloors() {
        return this.AuthHttp.get(`${this.basePath}/api/floors/`).toPromise();
    }

    getFloorsbyBuildingId(id) {
        return this.AuthHttp.get(`${this.basePath}/api/floors/building_id/${id}`).toPromise();
    }

    getFloorOrdersbyBuildingId(id) {
        return this.AuthHttp.get(`${this.basePath}/api/floors/get_order/building_id/${id}`).toPromise();
    }

    getFloorbyId(id) {
        return this.AuthHttp.get(`${this.basePath}/api/floors/floor_id/${id}`).toPromise();
    }

    uploadFloorFile(file) {
        console.log("enter upload floor log file api request");
        let formData: FormData = new FormData();
        formData.append('file', file, file.name);
        return this.AuthHttp.post(`${this.basePath}/api/floors/upload`, formData).toPromise();
    }
    createAynaRoute(aynarouteData){
        //return this.httpClient.post(`${this.basePath}/api/aynaroute/`, aynarouteData);
         return this.AuthHttp.post(`${this.basePath}/api/aynaroute/`, aynarouteData).toPromise();
    }
    editAynaRoute(aynarouteData){
        return this.AuthHttp.put(`${this.basePath}/api/aynaroute/`, aynarouteData).toPromise();
    }
    removeAynaRoute(aynaroute_id){
        return this.AuthHttp.delete(`${this.basePath}/api/aynaroute/${aynaroute_id}`).toPromise();
    }
    getAynaRouteByFloorId(floor_id){
        return this.AuthHttp.get(`${this.basePath}/api/aynaroute/getByFloorId/${floor_id}`).toPromise();
    }
    getAynaRoute(aynaroute_id){
        return this.AuthHttp.get(`${this.basePath}/api/aynaroute/${aynaroute_id}`).toPromise();
    }
    createPoi(poiData) {
        console.log("enter create POI api request" + poiData);
        return this.AuthHttp.post(`${this.basePath}/api/pois/`, poiData).toPromise();
    }

    editPoi(poiData) {
        console.log("enter edit POI api request" + poiData);
        return this.AuthHttp.put(`${this.basePath}/api/pois/`, poiData).toPromise();
    }

    removePoi(poi_id) {
        console.log("enter remove POI api request" + poi_id);
        return this.AuthHttp.delete(`${this.basePath}/api/pois/${poi_id}`).toPromise();
    }

    getPois() {
        return this.AuthHttp.get(`${this.basePath}/api/pois/`).toPromise();
    }

    getPoibyId(id) {
        return this.AuthHttp.get(`${this.basePath}/api/pois/${id}`).toPromise();
    }

    uploadPoiFile(file) {
        console.log("enter upload POI log file api request");
        let formData: FormData = new FormData();
        formData.append('file', file, file.name);
        return this.AuthHttp.post(`${this.basePath}/api/pois/upload`, formData).toPromise();
    }

    createFacility(facilityData) {
        console.log("enter create Facility api request" + facilityData);
        return this.AuthHttp.post(`${this.basePath}/api/facilities/`, facilityData).toPromise();
    }

    editFacility(facilityData) {
        console.log("enter edit Facility api request" + facilityData);
        return this.AuthHttp.put(`${this.basePath}/api/facilities/`, facilityData).toPromise();
    }

    removeFacility(facility_id) {
        console.log("enter remove Facility api request" + facility_id);
        return this.AuthHttp.delete(`${this.basePath}/api/facilities/${facility_id}`).toPromise();
    }

    getFacilities() {
        return this.AuthHttp.get(`${this.basePath}/api/facilities/`).toPromise();
    }

    getFacilitybyId(id) {
        return this.AuthHttp.get(`${this.basePath}/api/facilities/${id}`).toPromise();
    }

    uploadFacilityFile(file) {
        console.log("enter upload Facility log file api request");
        let formData: FormData = new FormData();
        formData.append('file', file, file.name);
        return this.AuthHttp.post(`${this.basePath}/api/facilities/upload`, formData).toPromise();
    }

    createDestination(destinationData) {
        console.log("enter create Destination api request" + destinationData);
        return this.AuthHttp.post(`${this.basePath}/api/destinations/`, destinationData).toPromise();
    }

    editDestination(destinationData) {
        console.log("enter edit Destination api request" + destinationData);
        return this.AuthHttp.put(`${this.basePath}/api/destinations/`, destinationData).toPromise();
    }

    removeDestination(destination_id) {
        console.log("enter remove Destination api request" + destination_id);
        return this.AuthHttp.delete(`${this.basePath}/api/destinations/${destination_id}`).toPromise();
    }

    getDestinations() {
        return this.AuthHttp.get(`${this.basePath}/api/destinations/`).toPromise();
    }

    getTopDestinations() {
        console.log("enter get TopDestinations api request" );
        return this.AuthHttp.get(`${this.basePath}/api/destinations/topList`).toPromise();
    }

    getBottomDestinations() {
        console.log("enter get BottomDestination api request");
        return this.AuthHttp.get(`${this.basePath}/api/destinations/bottomList`).toPromise();
    }

    getDestinationbyId(id) {
        return this.AuthHttp.get(`${this.basePath}/api/destinations/${id}`).toPromise();
    }

    uploadDestinationFile(file) {
        console.log("enter upload Destination log file api request");
        let formData: FormData = new FormData();
        formData.append('file', file, file.name);
        return this.AuthHttp.post(`${this.basePath}/api/destinations/upload`, formData).toPromise();
    }

    createFloorAccess(floorData) {
        console.log("enter create floor api request" + floorData);
        return this.AuthHttp.post(`${this.basePath}/api/flooraccesses/`, floorData).toPromise();
    }

    editFloorAccess(floorData) {
        console.log("enter edit floor access api request" + floorData);
        return this.AuthHttp.put(`${this.basePath}/api/flooraccesses/`, floorData).toPromise();
    }

    removeFloorAccess(floor_id) {
        console.log("enter remove floor access api request" + floor_id);
        return this.AuthHttp.delete(`${this.basePath}/api/flooraccesses/${floor_id}`).toPromise();
    }

    getFloorAccesses() {
        return this.AuthHttp.get(`${this.basePath}/api/flooraccesses/`).toPromise();
    }

    getFloorAccessbyId(id) {
        return this.AuthHttp.get(`${this.basePath}/api/flooraccesses/${id}`).toPromise();
    }

    createEmergency(emergencyData) {
        console.log("enter create Emergency api request" + emergencyData);
        return this.AuthHttp.post(`${this.basePath}/api/emergencies/`, emergencyData).toPromise();
    }

    editEmergency(emergencyData) {
        console.log("enter edit Emergency api request" + emergencyData);
        return this.AuthHttp.put(`${this.basePath}/api/emergencies/`, emergencyData).toPromise();
    }

    removeEmergency(emergency_id) {
        console.log("enter remove Emergency api request" + emergency_id);
        return this.AuthHttp.delete(`${this.basePath}/api/emergencies/${emergency_id}`).toPromise();
    }

    getEmergencies() {
        return this.AuthHttp.get(`${this.basePath}/api/emergencies/`).toPromise();
    }

    getEmergencybyId(id) {
        return this.AuthHttp.get(`${this.basePath}/api/emergencies/${id}`).toPromise();
    }

    uploadEmergencyFile(file) {
        console.log("enter upload Emergency log file api request");
        let formData: FormData = new FormData();
        formData.append('file', file, file.name);
        return this.AuthHttp.post(`${this.basePath}/api/emergencies/upload`, formData).toPromise();
    }

    createBeacon(beaconData) {
        console.log("enter create Emergency api request" + beaconData);
        return this.AuthHttp.post(`${this.basePath}/api/beacons/`, beaconData).toPromise();
    }

    editBeacon(beaconData) {
        console.log("enter edit Emergency api request" + beaconData);
        return this.AuthHttp.put(`${this.basePath}/api/beacons/`, beaconData).toPromise();
    }

    removeBeacon(beacon_id) {
        console.log("enter remove Emergency api request" + beacon_id);
        return this.AuthHttp.delete(`${this.basePath}/api/beacons/${beacon_id}`).toPromise();
    }

    getBeacons() {
        return this.AuthHttp.get(`${this.basePath}/api/beacons/`).toPromise();
    }

    getBeaconbyId(id) {
        return this.AuthHttp.get(`${this.basePath}/api/beacons/${id}`).toPromise();
    }

    getLocationsbyFloor_id(floor_id){
        return this.AuthHttp.get(`${this.basePath}/api/floors/getLocationbyID/${floor_id}`).toPromise();
    }

    searchbyName(name){
        return this.AuthHttp.get(`${this.basePath}/api/floors/getLocationbyName/${name}`).toPromise();
    }
}
