import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Permission } from "../../models/permission.model";
import { PermissionService } from "../../services/permission.service";

@Component({
  selector: "app-view-permission",
  templateUrl: "./view-permission.component.html",
  styleUrls: ["./view-permission.component.scss"],
})
export class ViewPermissionComponent implements OnInit {
  candidatePoolLoading: boolean;
  noResult: boolean;
  fieldSearchTerm: any;
  selectedSearchTerm: any;
  listLoading: boolean;

  selectedPermission: Permission;
  permissionForm: FormGroup;

  constructor(
    private permissionService: PermissionService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.getPermissionList();
    this.buildPermissionForm();
  }

  getPermissionList() {
    this.selectedPermission = this.permissionService.getPermissionList();
    return this.selectedPermission;
  }

  /**
   * Stores the selected Permission when the user clicks on edit button
   * @param permission
   */
  setPermission(permission): void {
    this.selectedPermission = permission;
    this.buildPermissionForm();
  }

  navigateToEditPermission(permission): void {
    this.router.navigate(["/rbac/permission/edit", permission.id]);
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
}
