import { Component , OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule }      from '@angular/forms';

import { Projects } from '../_models/index';
import { User } from '../_models/index';
import { AlertService, ProjectsService } from '../_services/index';

@Component({
    moduleId: module.id,
    templateUrl: 'projects.component.html'
})

export class ProjectsComponent implements OnInit {
    model: any = {};
    projectRecord: any = {};
    loading = false;
    projects: Projects[] = [];
    users: User[] = [];
    


    constructor(
        private router: Router,
        private projectsService: ProjectsService,
        private alertService: AlertService) { }

    ngOnInit() {
        this.loadAllProjects();
    }

    checkAllProjects(ev) {
        this.projects.forEach(x => x.state = ev.target.checked);
    }

    isAllProjectsChecked() {
        return this.projects.every(_ => _.state);
    }

    private getSelected() {
        return this.projects.filter((project) => project.state);
    }

    deleteProjects() { 
        console.log(this.getSelected());
        for (let project of this.getSelected()) {
            console.log(project);
            this.projectsService.delete(project._id).subscribe(data=>{console.log(data)});
        }
        //return this.projectsService.deleteProj(this.getSelected()).subscribe((res) =>{});
    }

    editRecord(project: any){
        this.projectRecord={};
        //this.addModel=false;
        console.log("In edit record");
        console.log(project);
        this.projectRecord=project;
    }

    updateProject(){
        console.log("In edit update:::");
        console.log(this.projectRecord);
        //this.addModel=true;
        this.projectsService.update(this.projectRecord).subscribe(data=>{console.log(data)});
        this.projectRecord={};
    }
 
    checkAll(ev) {
        this.users.forEach(x => x.state = ev.target.checked);
    }

    isAllChecked() {
        return this.users.every(_ => _.state);
    }

    addProject() {
        //this.addModel= true;
        this.loading = true;
        this.projectsService.create(this.model)
            .subscribe(
                data => {
                    this.alertService.success('Project added successfully', true);
                },
                error => {
                    this.alertService.error(error._body);
                    this.loading = false;
                });
    }

    private loadAllProjects() {
        this.projectsService.getAll().subscribe(projects => { this.projects = projects; });
        this.projectsService.getAllEmployees().subscribe(users => { this.users = users; });
    }
}
