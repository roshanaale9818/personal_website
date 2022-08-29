import { AssignRoleComponent } from "./components/manage-user/assign-role/assign-role.component";
import { AddDeviceIdComponent } from "./components/manage-user/add-device-id/add-device-id.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ManageUserComponent } from "./components/manage-user/manage-user.component";
import { ArchiveUserComponent } from "./components/manage-user/archive-user/archive-user.component";
import { ActiveUserComponent } from "./components/manage-user/active-user/active-user.component";
import { RoleGuard } from "@app/core/guards/role.guard";
import { ParentMenuRoute } from "@app/core/guards/auth/services/parentMenu";

const routes: Routes = [
  {
    path: "",
    component: ManageUserComponent,
    canActivate: [RoleGuard],

    children: [
      {
        path: "",
        redirectTo: "active-list",
        pathMatch: "full",
        canActivate: [RoleGuard],
      },
      {
        path: "archive-list",
        component: ArchiveUserComponent,
        canActivate: [RoleGuard],
      },

      {
        path: "active-list",
        component: ActiveUserComponent,
        canActivate: [RoleGuard],
      },
    ],
  },

  {
    path: "device-id/:id",
    component: AddDeviceIdComponent,
    data: {
      breadcrumb: "Staff Detail",
    },
  },
  {
    path: "assign-role/:id",
    component: AssignRoleComponent,
    data: {
      breadcrumb: "Assign Role",
      parentMenuRoute:ParentMenuRoute.manageEmployee
    },
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageUserRoutingModule {}
