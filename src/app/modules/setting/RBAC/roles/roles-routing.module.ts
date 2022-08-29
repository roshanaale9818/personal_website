import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ParentMenuRoute } from "@app/core/guards/auth/services/parentMenu";
import { RoleGuard } from "@app/core/guards/role.guard";
import { ListRolesComponent } from "./components/list-roles/list-roles.component";

import { RolesComponent } from "./components/roles/roles.component";
import { ViewRolesComponent } from "./components/view-roles/view-roles.component";

const routes: Routes = [
  { path: "", component: ListRolesComponent,canActivate:[RoleGuard] },
  {
    path: "add",
    component: RolesComponent,
    canActivate:[RoleGuard]
  },
  {
    path: "edit/:id",
    component: RolesComponent,
    data:{
      parentMenuRoute:ParentMenuRoute.roles
    },
    canActivate:[RoleGuard]
  },
  {
    path: "view/:id",
    component: ViewRolesComponent,
    data:{
      parentMenuRoute:ParentMenuRoute.roles
    },
    canActivate:[RoleGuard]
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RolesRoutingModule {}
