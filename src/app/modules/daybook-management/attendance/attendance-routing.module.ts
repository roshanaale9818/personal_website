import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RoleGuard } from "@app/core/guards/role.guard";

import { AttendanceComponent } from "./components/attendance.component";

const routes: Routes = [
  { path: "", component: AttendanceComponent, canActivate: [RoleGuard] },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AttendanceRoutingModule {}
