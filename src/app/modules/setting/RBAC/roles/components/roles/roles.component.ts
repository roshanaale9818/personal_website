import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { RolesService } from "../../services/roles.service";

@Component({
  selector: "app-roles",
  templateUrl: "./roles.component.html",
  styleUrls: ["./roles.component.scss"],
})
export class RolesComponent implements OnInit {
  rolesForm: FormGroup;
  selectedRoles;
  editMode: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private rolesService: RolesService,
    private router: Router
  ) {}

  ngOnInit() {
    this.buildRolesForm();
    this.analyzeRoute();
  }

  buildRolesForm(): void {
    this.rolesForm = this.formBuilder.group({
      name: [
        this.selectedRoles ? this.selectedRoles.name : "",
        [Validators.required],
      ],
      description: [this.selectedRoles ? this.selectedRoles.description : ""],
    });
  }

  analyzeRoute(): void {
    if (this.router.url.includes("edit")) {
      this.editMode = true;
      this.selectedRoles = this.rolesService.getRolesList();
      this.buildRolesForm();
    }
  }

  onSubmitRoles(): void {}
}
