import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { AppConfig } from '../app.config';
import { User } from '../_models/index';

@Injectable()
export class EmployeeService {
    constructor(private http: Http, private config: AppConfig) { }

    getAll() {
        return this.http.get(this.config.apiUrl + '/projects/getAll', this.jwt()).map((response: Response) => response.json());
    }

    getAllEmployees() {
        return this.http.get(this.config.apiUrl + '/projects/getAllEmployees', this.jwt()).map((response: Response) => response.json());
    }

    getById(_id: string) {
        return this.http.get(this.config.apiUrl + '/projects/' + _id, this.jwt()).map((response: Response) => response.json());
    }

    /*create(projects: Projects) {
        console.log("In service ts");
        console.log(projects);
        return this.http.post(this.config.apiUrl + '/projects/addProject', projects, this.jwt());
    }

    update(projects: Projects) {
        console.log("In update ts:");
        console.log(projects);
        return this.http.put(this.config.apiUrl + '/projects/' + projects._id, projects, this.jwt());
    }
*/
  

    delete(_id: string) {
        console.log("In service tsdfasdfss");
        console.log(_id);
        return this.http.delete(this.config.apiUrl + '/projects/' + _id, this.jwt()).map((response:Response) => response);
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