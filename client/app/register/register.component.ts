import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AlertService, UserService } from '../_services/index';

@Component({
    moduleId: module.id,
    templateUrl: 'register.component.html'
})

export class RegisterComponent {
    model: any = {};
    loading = false;
    regOwnerData: any = {};
    regEmpData: any = {};

    constructor(
        private router: Router,
        private userService: UserService,
        private alertService: AlertService) { }

    registerOwner(){
        console.log(this.regOwnerData);
        this.userService.create(this.regOwnerData)
            .subscribe(
                data => {
                    this.alertService.success('Registration successful', true);
                    this.router.navigate(['/login']);
                },
                error => {
                    this.alertService.error(error._body);
                    this.loading = false;
                });
    }

    registerEmployee(){
        console.log(this.regEmpData);
        /*this.userService.createInvitedEmployee(this.regEmpData)
            .subscribe(
                data => {
                    //this.alertService.success('Registration successful', true);
                    this.router.navigate(['/timesheet']);
                },
                error => {
                    this.alertService.error(error._body);
                    this.loading = false;
                });*/
    }

    register() {
        this.loading = true;
        this.userService.create(this.model)
            .subscribe(
                data => {
                    this.alertService.success('Registration successful', true);
                    this.router.navigate(['/login']);
                },
                error => {
                    this.alertService.error(error._body);
                    this.loading = false;
                });
    }
}
