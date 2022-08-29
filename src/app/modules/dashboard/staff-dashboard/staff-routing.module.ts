import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RoleGuard } from "@app/core/guards/role.guard";
import { StaffDashboardComponent } from "./component/staff-dashboard.component";
import { TcaStaffDashboardComponent } from "./component/tca-staff-dashboard/tca-staff-dashboard.component";

const routes: Routes = [
  { path: "", component: StaffDashboardComponent,canActivate:[RoleGuard] },
  { path: "original", component: TcaStaffDashboardComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffRoutingModule {}
