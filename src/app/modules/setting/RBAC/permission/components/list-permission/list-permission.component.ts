import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import {
  DataStateChangeEvent,
  GridDataResult,
} from "@progress/kendo-angular-grid";
import { State, process } from "@progress/kendo-data-query";
import { Permission } from "../../models/permission.model";
import { PermissionService } from "../../services/permission.service";

@Component({
  selector: "app-list-permission",
  templateUrl: "./list-permission.component.html",
  styleUrls: ["./list-permission.component.scss"],
})
export class ListPermissionComponent implements OnInit {
  permissionForm: FormGroup;
  flexyearLoading: boolean;

  selectedPermission: Permission;

  // Kendo Table
  permissionList: any[] = [
    {
      id: 1,
      name: "General Staff",
      description: "(not set)",
    },
    {
      id: 2,
      name: "Manager",
      description: "(not set)",
    },
    {
      id: 3,
      name: "Engineer",
      description: "(not set)",
    },
    {
      id: 4,
      name: "Doctor",
      description: "(not set)",
    },
    {
      id: 5,
      name: "Nurse",
      description: "(not set)",
    },
  ];
  public state: State = {
    skip: 0,
    take: 10,
    //initial filter descriptor
    filter: {
      logic: "and",
      filters: [],
    },
    sort: [{ dir: "desc", field: "Permission" }],
  };
  public gridView: GridDataResult = process(this.permissionList, this.state);

  constructor(
    private formBuilder: FormBuilder,
    private permissionService: PermissionService,
    private router: Router
  ) {}

  ngOnInit() {}

  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.gridView = process(this.permissionList, this.state);
  }

  navigateToAddPermission(): void {
    this.router.navigate(["setting/rbac/permission/add"]);
  }

  navigateToUpdatePermission(permission: Permission): void {
    this.permissionService.setPermissionList(permission);
    this.router.navigate(["setting/rbac/permission/edit", permission.id]);
  }

  navigateToViewPermission(permission: Permission): void {
    this.permissionService.setPermissionList(permission);
    this.router.navigate(["setting/rbac/permission/view", permission.id]);
  }
}
