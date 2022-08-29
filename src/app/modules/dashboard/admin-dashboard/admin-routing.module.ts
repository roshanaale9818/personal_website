import { NgModule } from "@angular/core";

import { Routes, RouterModule } from "@angular/router";
import { RoleGuard } from "@app/core/guards/role.guard";
import { AdminDashboardComponent } from "./component/admin-dashboard/admin-dashboard.component";
import { TcaAdminDashboardComponent } from "./component/admin-dashboard/tca-admin-dashboard/tca-admin-dashboard.component";
// TcaAdminDashboardComponent
const routes: Routes = [
  { path: "", component: TcaAdminDashboardComponent,canActivate:[RoleGuard] }
,
{
  path:"original",
  component:AdminDashboardComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers:[RoleGuard]
})
export class AdminRoutingModule {}
