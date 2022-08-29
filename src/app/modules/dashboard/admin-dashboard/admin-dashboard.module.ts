import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SharedModule } from "@app/shared/shared.module";
import { AdminRoutingModule } from "./admin-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AdminDashboardComponent } from "./component/admin-dashboard/admin-dashboard.component";
import { TcaAdminDashboardComponent } from './component/admin-dashboard/tca-admin-dashboard/tca-admin-dashboard.component';
import { CorrectionAttendanceModule } from "@app/modules/daybook-management/correction-attendance/correction-attendance.module";

@NgModule({
  declarations: [AdminDashboardComponent, TcaAdminDashboardComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    CorrectionAttendanceModule
  ]
})
export class AdminDashboardModule {}
