import { UpdateStaffDetailComponent } from "./components/update-staff-detail/update-staff-detail.component";
import { StaffDetailComponent } from "./components/staff-detail/staff-detail.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ManageStaffComponent } from "./components/manage-staff.component";
import { AddStaffComponent } from "./components/add-staff/add-staff.component";
import { UserCredentialComponent } from "./components/add-staff/user-credential/user-credential.component";
import { RoleGuard } from "@app/core/guards/role.guard";
import { RolesAccess } from "@app/core/guards/auth/services/rolesaccess";
import { ParentMenuRoute } from "@app/core/guards/auth/services/parentMenu";

const routes: Routes = [
  {
    path: "",
    component: ManageStaffComponent,
    canActivate: [RoleGuard],
  },
  {
    path: "add",
    component: AddStaffComponent,
    canActivate: [RoleGuard],
    data: {
      breadcrumb: "Add Staff",
    },
    children: [
      {
        path: "user-credentials",
        component: UserCredentialComponent,
        canActivate: [RoleGuard],
        data: {
          breadcrumb: "User Credentials",
          roles: ["Admin","Manager","Super Admin"],
        },
      },
    ],
  },
  {
    path: "edit/:id",
    component: AddStaffComponent,
    canActivate: [RoleGuard],
    data: {
      breadcrumb: "Edit Staff",
      // roles: ["Admin","Manager","Super Admin"],
      roles:RolesAccess.editAccess,
      parentMenuRoute:ParentMenuRoute.manageEmployee
    },
  },
  {
    path: "view/:id",
    component: StaffDetailComponent,
    canActivate: [RoleGuard],
    data: {
      breadcrumb: "Staff Detail",
      // roles: ["Admin","Manager","HR","Super Admin"],
      roles:RolesAccess.viewAccess,
      parentMenuRoute:ParentMenuRoute.manageEmployee
    },
  },
  {
    path: "update/:id",
    component: UpdateStaffDetailComponent,
    canActivate: [RoleGuard],
    data: {
      breadcrumb: "Staff Update",
      // roles: ["Admin","Manager","Super Admin"],
      roles:RolesAccess.updateAccess,
      parentMenuRoute:ParentMenuRoute.manageEmployee
    },
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageStaffRoutingModule {}
