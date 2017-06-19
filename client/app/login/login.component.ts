import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, AuthenticationService, UserService } from '../_services/index';

@Component({
    moduleId: module.id,
    templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {
    model: any = {};
    resetPassword : any={};
    loading = false;
    returnUrl: string;
    loginTrue = true;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService) { }

    ngOnInit() {
        //console.log(this.route);
        console.log(this.loginTrue);
        // reset login status
        this.authenticationService.logout();

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/employee';
    }

    getForgetPassword(){
        this.loginTrue=false;
        //console.log(this.loginTrue);
    }

    getLoginForm(){
        this.loginTrue=true;
        console.log(this.loginTrue);
    }

    forgotPassword() {
        console.log(this.resetPassword);
        this.userService.forgotPassword(this.resetPassword)
            .subscribe(
                data => {
                    this.alertService.success('Password reset instructions are sent to email id', true);
                    //this.router.navigate(['/login']);
                    this.loginTrue=true;
                },
                error => {
                    this.alertService.error(error._body);
                    //this.loading = false;
                });
    }

    login() {
        this.loading = true;
        this.authenticationService.login(this.model.username, this.model.password)
            .subscribe(
                data => {
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    this.alertService.error(error._body);
                    this.loading = false;
                });
    }
}
