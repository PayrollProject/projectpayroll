import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { AppConfig } from '../app.config';
import { Location } from '../_models/index';

@Injectable()
export class LocationService {
    constructor(private http: Http, private config: AppConfig) { }

    getAll() {
        return this.http.get(this.config.apiUrl + '/locations', this.jwt()).map((response: Response) => response.json());
    }

    getById(_id: string) {
        return this.http.get(this.config.apiUrl + '/locations/' + _id, this.jwt()).map((response: Response) => response.json());
    }

    create(locationName:string, country:string, address:string, phone:string, billrate:string) {
        
        
       

        return this.http.post(this.config.apiUrl + '/locations/addLocation', location, this.jwt());
    }

    update(location: Location) {
        return this.http.put(this.config.apiUrl + '/locations/' + location._id, location, this.jwt());
    }

    delete(_id: string) {
        return this.http.delete(this.config.apiUrl + '/locations/' + _id, this.jwt());
    }

    // private helper methods

    private jwt() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });
            return new RequestOptions({ headers: headers });
        }
    }
}