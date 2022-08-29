import { UploadsModule } from "@progress/kendo-angular-upload";
import { InputsModule } from "@progress/kendo-angular-inputs";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ClientRoutingModule } from "./client-routing.module";
import { ClientComponent } from "./components/client.component";
import { ListClientComponent } from "./components/list-client/list-client.component";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "@app/shared/shared.module";
import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";

import { GridModule } from "@progress/kendo-angular-grid";
import { ComboBoxModule } from "@progress/kendo-angular-dropdowns";

import { ClientIpModalComponent } from "./components/client-ip-modal/client-ip-modal.component";

import { DateInputsModule } from "@progress/kendo-angular-dateinputs";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/admin/", ".json");
}
@NgModule({
  declarations: [
    ClientComponent,
    ListClientComponent,
    //  ClientDetailComponent,
    //ClientContactComponent,
    // ClientDepartmentComponent,
    // ClientDivisionComponent,
    // ClientEmployeesComponent,
    // ClientIpAddressComponent,
    ClientIpModalComponent,
    // ActiveClientEmployeesComponent,
    // ClientShiftComponent,
    // ClientAttendanceThresholdComponent,
    // ClientStaffShiftComponent,
    // GraceRuleComponent,
    // ArchiveClientEmployeesComponent,
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    GridModule,
    ComboBoxModule,
    InputsModule,
    UploadsModule,
    DateInputsModule,

    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
      isolate: true,
    }),
  ],
  entryComponents: [ClientIpModalComponent],
})
export class ClientModule {}
