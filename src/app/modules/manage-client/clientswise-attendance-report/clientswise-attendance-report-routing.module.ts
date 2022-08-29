import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ClientwiseAttendanceReportComponent } from "./components/clientwise-attendance-report.component";

const routes: Routes = [
  {
    path: "",
    component: ClientwiseAttendanceReportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientswiseAttendanceReportRoutingModule {}
