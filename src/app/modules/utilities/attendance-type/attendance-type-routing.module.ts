import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RoleGuard } from "@app/core/guards/role.guard";
import { AttendanceTypeComponent } from "./components/attendance-type.component";

const routes: Routes = [
  {
    path: "",
    component: AttendanceTypeComponent,
    canActivate:[RoleGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AttendanceTypeRoutingModule {}
