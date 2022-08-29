import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RoleGuard } from "@app/core/guards/role.guard";

import { WeekendManagementComponent } from "./components/weekend-management.component";

const routes: Routes = [{ path: "", component: WeekendManagementComponent,canActivate:[RoleGuard] }];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WeekendManagementRoutingModule {}
