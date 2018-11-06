'use strict';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import {environment} from "../../environments/environment";


function handleError(err) {
    return Observable.throw(err.json().error || 'Server error');
}

@Injectable()
export class LocationService {
    AuthHttp;
    basePath = environment.basePath;

    static parameters = [AuthHttp];
    constructor(private authHttp: AuthHttp) {
        this.AuthHttp = authHttp;
    }

    query() {
        return this.AuthHttp.get(`${this.basePath}/api/customers/`).toPromise();
    }
    get(user: any = {id: 'me'}): Observable<any> {
        return this.AuthHttp.get(`${this.basePath}/api/customers/${user.id || user._id}`).toPromise();
    }
    
    getCategory(user: any = {id: 'me'}): Observable<any>  {
        return this.AuthHttp.get(`${this.basePath}/api/categories/${user.id || user._id}`)
        .map((res: Response) => res.json())
        .catch(handleError);    
    }

    addCategory(category) {
        return this.AuthHttp.post(`${this.basePath}/api/categories/`, category).toPromise();
    }

    updateCategory(category) {
        return this.AuthHttp.put(`${this.basePath}/api/categories/`, category).toPromise();
    }

    getUsingbyCategory_id(category) {
        return this.AuthHttp.get(`${this.basePath}/api/categories/use/${category.id || category._id}`).toPromise();
    }

    removeCategory(category) {
        return this.AuthHttp.delete(`${this.basePath}/api/categories/${category.id || category._id}`).toPromise();
    }

    changePassword(user, oldPassword, newPassword) {
        return this.AuthHttp.put(`${this.basePath}/api/customers/${user.id || user._id}/password`, {oldPassword, newPassword})
            .map((res: Response) => res.json())
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

    getGroup(user: any = {id: 'me'}): Observable<any>  {
        return this.AuthHttp.get(`${this.basePath}/api/groups/${user.id || user._id}`)
        .map((res: Response) => res.json())
        .catch(handleError);    
    }

    addGroup(group) {
        return this.AuthHttp.post(`${this.basePath}/api/groups/`, group).toPromise();
    }

    updateGroup(group) {
        return this.AuthHttp.put(`${this.basePath}/api/groups/`, group).toPromise();
    }

    removeGroup(group) {
        return this.AuthHttp.delete(`${this.basePath}/api/groups/${group.id || group._id}`).toPromise();
    }

    getPlayer(user: any = {id: 'me'}): Observable<any>  {
        return this.AuthHttp.get(`${this.basePath}/api/players/${user.id || user._id}`)
        .map((res: Response) => res.json())
        .catch(handleError);    
    }

    addPlayer(player) {
        return this.AuthHttp.post(`${this.basePath}/api/players/`, player).toPromise();
    }

    updatePlayer(player) {
        return this.AuthHttp.put(`${this.basePath}/api/players/`, player).toPromise();
    }

    removePlayer(id) {
        return this.AuthHttp.delete(`${this.basePath}/api/players/${id}`).toPromise();
    }

    getPlayerbyId(id) {
        return this.AuthHttp.get(`${this.basePath}/api/players/${id}`).toPromise();
    }
}
