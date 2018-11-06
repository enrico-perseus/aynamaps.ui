'use strict';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Rx';
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
export class UserService {
    AuthHttp;
    basePath = environment.basePath;

    static parameters = [AuthHttp];
    constructor(private authHttp: AuthHttp) {
        this.AuthHttp = authHttp;
    }

    query(): Observable<UserType[]> {
        return this.AuthHttp.get(`${this.basePath}/api/users/`)
            .map((res: Response) => res.json())
            .catch(handleError);
    }
    get(user: UserType = {id: 'me'}): Observable<UserType> {
        return this.AuthHttp.get(`${this.basePath}/api/users/${user.id || user._id}`)
            .map((res: Response) => res.json())
            .catch(handleError);
    }
    create(user: UserType) {
        return this.AuthHttp.post(`${this.basePath}/api/users/`, user)
            .map((res: Response) => res.json())
            .catch(handleError);
    }
    changePassword(user, name, oldPassword, newPassword, avatarUrl) {
        return this.AuthHttp.put(`${this.basePath}/api/users/${user.id || user._id}/password`, {name, oldPassword, newPassword, avatarUrl})
            .map((res: Response) => res.json())
            .catch(handleError);
    }
    remove(user) {
        return this.AuthHttp.delete(`${this.basePath}/api/users/${user.id || user._id}`)
            .map(() => user)
            .catch(handleError);
    }
}
