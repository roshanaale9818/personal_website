import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AttendanceDetailComponent } from "./components/attendance-detail.component";

const routes: Routes = [{ path: "", component: AttendanceDetailComponent }];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceDetailRoutingModule {}
