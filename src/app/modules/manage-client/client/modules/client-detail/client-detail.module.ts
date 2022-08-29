import { ArchiveClientEmployeesComponent } from "./../../components/client-employees/components/archive-client-employees/archive-client-employees.component";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ClientDetailRoutingModule } from "./client-detail-routing.module";
import { ClientDetailComponent } from "../../components/client-detail/client-detail.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "@app/shared/shared.module";
import { GridModule } from "@progress/kendo-angular-grid";
import { ComboBoxModule } from "@progress/kendo-angular-dropdowns";
import { InputsModule } from "@progress/kendo-angular-inputs";
import { UploadsModule } from "@progress/kendo-angular-upload";
import { DateInputsModule } from "@progress/kendo-angular-dateinputs";
import { ClientDepartmentComponent } from "../../components/client-department/client-department.component";
import { ClientInfoComponent } from "../../components/client-info/client-info.component";
import { ClientContactComponent } from "../../components/client-contact/client-contact.component";
import { ClientDivisionComponent } from "../../components/client-division/client-division.component";
import { ClientIpAddressComponent } from "../../components/client-ip-address/client-ip-address.component";
import { ClientIpModalComponent } from "../../components/client-ip-modal/client-ip-modal.component";
import { ClientShiftComponent } from "../../components/client-shift/client-shift.component";
import { ClientStaffShiftComponent } from "../../components/client-staff-shift/client-staff-shift.component";
import { ClientAttendanceThresholdComponent } from "../../components/clientwise-attendance-threshold/client-attendance-threshold.component";
import { GraceRuleComponent } from "../../components/grace-rule/grace-rule.component";
import { ClientEmployeesComponent } from "../../components/client-employees/components/active-client-employees/client-employees.component";
import { ClientBranchModule } from "@app/modules/manage-client/client-branch/client-branch.module";

@NgModule({
  declarations: [
    ClientDetailComponent,
    ClientDepartmentComponent,
    ClientInfoComponent,
    ClientContactComponent,
    ClientDivisionComponent,
    ClientEmployeesComponent,
    ClientIpAddressComponent,
    // ClientIpModalComponent,
    ClientShiftComponent,
    ClientAttendanceThresholdComponent,
    ClientStaffShiftComponent,
    GraceRuleComponent,
    ArchiveClientEmployeesComponent,
  ],
  imports: [
    CommonModule,
    ClientDetailRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    GridModule,
    ComboBoxModule,
    InputsModule,
    UploadsModule,
    DateInputsModule,
    ClientBranchModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ClientDetailModule {}
