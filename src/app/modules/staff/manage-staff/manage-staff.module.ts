import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ManageStaffRoutingModule } from "./manage-staff-routing.module";
import { ManageStaffComponent } from "./components/manage-staff.component";
import { AddStaffComponent } from "./components/add-staff/add-staff.component";
import { SharedModule } from "@app/shared/shared.module";
import { AcademicQualificationComponent } from "./components/add-staff/academic-qualification/academic-qualification.component";
import { QualificationListComponent } from "./components/add-staff/academic-qualification/qualification-list/qualification-list.component";
import { AddQualificationComponent } from "./components/add-staff/academic-qualification/add-qualification/add-qualification.component";
import { AttachmentComponent } from "./components/add-staff/attachment/attachment.component";
import { AddAttachmentComponent } from "./components/add-staff/attachment/add-attachment/add-attachment.component";

import { GridModule } from "@progress/kendo-angular-grid";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { CollapseModule } from "ngx-bootstrap/collapse";
import { StaffDetailComponent } from "./components/staff-detail/staff-detail.component";

import { Ng2TelInputModule } from "ng2-tel-input";
import { InputsModule } from "@progress/kendo-angular-inputs";
import { UploadsModule } from "@progress/kendo-angular-upload";
import { UserCredentialComponent } from "./components/add-staff/user-credential/user-credential.component";
import { FundTypeComponent } from "./components/fund-type/fund-type.component";
import { UpdateStaffDetailComponent } from './components/update-staff-detail/update-staff-detail.component';

@NgModule({
  declarations: [
    ManageStaffComponent,
    AddStaffComponent,
    AcademicQualificationComponent,
    QualificationListComponent,
    AddQualificationComponent,
    AttachmentComponent,
    AddAttachmentComponent,

    StaffDetailComponent,
    UserCredentialComponent,
    FundTypeComponent,
    UpdateStaffDetailComponent,
  ],
  imports: [
    CommonModule,
    ManageStaffRoutingModule,
    SharedModule,
    GridModule,
    DropDownsModule,
    CollapseModule,
    Ng2TelInputModule,
    UploadsModule,
  ],
})
export class ManageStaffModule {}
