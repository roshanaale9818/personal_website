import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ParentMenuRoute } from "@app/core/guards/auth/services/parentMenu";
import { RoleGuard } from "@app/core/guards/role.guard";
import { CompanyDetailComponent } from "./components/company-detail/company-detail.component";
import { CompanyUserComponent } from "./components/company-user/company-user/company-user.component";

import { CompanyComponent } from "./components/company.component";

const routes: Routes = [
  { path: "", component: CompanyComponent, canActivate: [RoleGuard] },
  {
    path: "details/:id",
    component: CompanyDetailComponent,
    canActivate: [RoleGuard],
    // data: {
    //   roles: ["Admin", "Super Admin"],

    // },
    data:{
      parentMenuRoute:ParentMenuRoute.company
    }
  },
  {
    path: "company-user/:id",
    component: CompanyUserComponent,
    canActivate: [RoleGuard],
    data: {
      // roles: ["Admin", "Super Admin"],
        parentMenuRoute:ParentMenuRoute.company
    },
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyRoutingModule {}
