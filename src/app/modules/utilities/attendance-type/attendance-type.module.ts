import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AttendanceTypeRoutingModule } from "./attendance-type-routing.module";
import { AttendanceTypeComponent } from "./components/attendance-type.component";
import { SharedModule } from "../../../shared/shared.module";

@NgModule({
  declarations: [AttendanceTypeComponent],
  imports: [CommonModule, AttendanceTypeRoutingModule, SharedModule],
})
export class AttendanceTypeModule {}
