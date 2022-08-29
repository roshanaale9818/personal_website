import { MonthlyReportComponent } from "./../../reports/monthly-report/components/monthly-report.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SharedModule } from "@app/shared/shared.module";
import { StaffRoutingModule } from "./staff-routing.module";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { StaffDashboardComponent } from "./component/staff-dashboard.component";
import { TcaStaffDashboardComponent } from "./component/tca-staff-dashboard/tca-staff-dashboard.component";
import { BentRayStaffDashboardComponent } from "./component/bent-ray-staff-dashboard/bent-ray-staff-dashboard.component";
import { PopoverModule } from "ngx-bootstrap/popover";
@NgModule({
  declarations: [
    StaffDashboardComponent,
    TcaStaffDashboardComponent,
    BentRayStaffDashboardComponent
    // MonthlyReportComponent
  ],
  imports: [
    CommonModule,
    StaffRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    PopoverModule.forRoot()
  ]
})
export class StaffDashboardModule {}
