import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Permission } from "../../models/permission.model";
import { PermissionService } from "../../services/permission.service";

@Component({
  selector: "app-permission",
  templateUrl: "./permission.component.html",
  styleUrls: ["./permission.component.scss"],
})
export class PermissionComponent implements OnInit {
  permissionForm: FormGroup;

  flexyearLoading: boolean;
  editMode: boolean;

  selectedPermission: Permission;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private permissionService: PermissionService
  ) {}

  ngOnInit() {
    this.buildPermissionForm();
    this.analyzeRoute();
  }

  buildPermissionForm(): void {
    this.permissionForm = this.formBuilder.group({
      name: [
        this.selectedPermission ? this.selectedPermission.name : "",
        [Validators.required],
      ],
      description: [
        this.selectedPermission ? this.selectedPermission.description : "",
      ],
      rule_name: [
        this.selectedPermission ? this.selectedPermission.rule_name : "",
      ],
      data: [this.selectedPermission ? this.selectedPermission.data : ""],
    });
  }

  analyzeRoute(): void {
    if (this.router.url.includes("edit")) {
      this.editMode = true;
      this.selectedPermission = this.permissionService.getPermissionList();
      this.buildPermissionForm();
    }
  }

  onSubmitPermission(): void {
    if (this.editMode) {
    }
  }
}
