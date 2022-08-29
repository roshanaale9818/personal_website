import { Injectable } from "@angular/core";
import { Permission } from "../models/permission.model";

@Injectable({
  providedIn: "root",
})
export class PermissionService {
  selectedPermission: Permission;
  constructor() {}

  setPermissionList(permission: Permission): void {
    this.selectedPermission = permission;
  }

  getPermissionList() {
    return this.selectedPermission;
  }
}
