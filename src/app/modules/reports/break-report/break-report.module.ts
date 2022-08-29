import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { BreakReportRoutingModule } from "./break-report-routing.module";
import { BreakReportComponent } from "./components/break-report.component";
import { SharedModule } from "@app/shared/shared.module";

@NgModule({
  declarations: [BreakReportComponent],
  imports: [CommonModule, BreakReportRoutingModule, SharedModule],
})
export class BreakReportModule {}
