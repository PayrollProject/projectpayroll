import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AlertService, LocationService } from '../_services/index';

@Component({
    moduleId: module.id,
    templateUrl: 'location.component.html'
})

export class LocationComponent {
    model: any = {};
    loading = false;

    constructor(
        private router: Router,
        private locationService: LocationService,
        private alertService: AlertService) { }

    addLocation() {
        this.loading = true;
        console.log(this.model);

        
    }
}
