import { AddClientLocationComponent } from "./components/add-client-location/add-client-location.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ClientBranchComponent } from "./components/client-branch.component";
import { RoleGuard } from "@app/core/guards/role.guard";
import { ParentMenuRoute } from "@app/core/guards/auth/services/parentMenu";

const routes: Routes = [
  { path: "", component: ClientBranchComponent, canActivate: [RoleGuard] },
  {
    path: "add-location/:id",
    component: AddClientLocationComponent,
    canActivate: [RoleGuard],
    data: {
      roles: ["Admin", "Super Admin"] ,
      parentMenuRoute:ParentMenuRoute.manageClientBranch
  },
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientBranchRoutingModule {}
