import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/index';
import { LoginComponent } from './login/index';
import { RegisterComponent } from './register/index';
import { AuthGuard } from './_guards/index';
import { LocationComponent } from './location/index';
import { ProjectsComponent } from './projects/index';
import { EmployeeComponent } from './employee/index';


const appRoutes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'addLocation', component: LocationComponent},
    { path: 'location', component: LocationComponent},
    { path: 'projects', component: ProjectsComponent},
    { path: 'employee', component: EmployeeComponent},

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);