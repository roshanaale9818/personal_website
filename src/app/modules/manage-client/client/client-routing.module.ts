import { ClientDetailComponent } from "./components/client-detail/client-detail.component";
import { ClientComponent } from "./components/client.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { BreadcrumbsModule } from "ng6-breadcrumbs";
import { ClientDepartmentComponent } from "./components/client-department/client-department.component";
import { RoleGuard } from "@app/core/guards/role.guard";
import { RolesAccess } from "@app/core/guards/auth/services/rolesaccess";
import { ParentMenuRoute } from "@app/core/guards/auth/services/parentMenu";

const routes: Routes = [
  { path: "", component: ClientComponent, canActivate: [RoleGuard] },
  {
    path: "client-detail/:id",

    loadChildren:
      "@flexyear-modules/manage-client/client/modules/client-detail/client-detail.module#ClientDetailModule",
    canActivate: [RoleGuard],
    data: {
      // roles: ["Admin", "Super Admin"],
      roles:RolesAccess.viewAccess,
      parentMenuRoute:ParentMenuRoute.manageClient
    },
  },
  // {
  //   path: "client-detail/:id/archive-client",
  //   loadChildren:
  //     "@flexyear-modules/manage-client/client/modules/client-detail/client-detail.module#ClientDetailModule",
  //   data: {
  //     breadcrumb: "Archive Client",
  //   },
  // },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientRoutingModule {}
