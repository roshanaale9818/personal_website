import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ClientswiseAttendanceReportRoutingModule } from "./clientswise-attendance-report-routing.module";
import { ClientwiseAttendanceReportComponent } from "./components/clientwise-attendance-report.component";
import { SharedModule } from "@app/shared/shared.module";

@NgModule({
  declarations: [ClientwiseAttendanceReportComponent],
  imports: [
    CommonModule,
    ClientswiseAttendanceReportRoutingModule,
    SharedModule,
  ],
})
export class ClientswiseAttendanceReportModule {}
