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
export class LanguageService {
    AuthHttp;
    basePath = environment.basePath;

    static parameters = [AuthHttp];
    constructor(private authHttp: AuthHttp) {
        this.AuthHttp = authHttp;
    }

    create(language) {
        return this.AuthHttp.post(`${this.basePath}/api/languages/`, language).toPromise();
    }
    
    query() {
        return this.AuthHttp.get(`${this.basePath}/api/languages/`).toPromise();
    }
    
    get(languageId) {
        return this.AuthHttp.get(`${this.basePath}/api/languages/${languageId}`).toPromise();
    }
    
    update(language) {
        return this.AuthHttp.put(`${this.basePath}/api/languages/`, language).toPromise();
    }

    remove(languageId) {
        return this.AuthHttp.delete(`${this.basePath}/api/languages/${languageId}`).toPromise();
    }

    /*
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
    */
}
