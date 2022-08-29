import { RoleGuard } from "./../../../core/guards/role.guard";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { CorrectionAttendanceComponent } from "./components/correction-attendance.component";

const routes: Routes = [
  {
    path: "",
    component: CorrectionAttendanceComponent,
    canActivate: [RoleGuard],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CorrectionAttendanceRoutingModule {}
