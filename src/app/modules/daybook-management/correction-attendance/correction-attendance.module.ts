import { PendingCorrectionAttendanceComponent } from "./components/pending-correction-attendance/pending-correction-attendance.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CorrectionAttendanceComponent } from "./components/correction-attendance.component";
import { CorrectionAttendanceRoutingModule } from "./correction-attendance-routing.module";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "@app/shared/shared.module";
import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";

import { GridModule } from "@progress/kendo-angular-grid";
import { IntlModule } from "@progress/kendo-angular-intl";
import { DateInputsModule } from "@progress/kendo-angular-dateinputs";
import { DeclinedCorrectonAttendanceComponent } from './components/declined-correction-attendance/declined-correcton-attendance.component';
import { ApprovedCorrectionAttendanceComponent } from './components/approved-correction-attendance/approved-correction-attendance.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/admin/", ".json");
}
@NgModule({
  declarations: [
    CorrectionAttendanceComponent,
    PendingCorrectionAttendanceComponent,
    DeclinedCorrectonAttendanceComponent,
    ApprovedCorrectionAttendanceComponent,
  ],
  imports: [
    CommonModule,
    CorrectionAttendanceRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    IntlModule,
    DateInputsModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
      isolate: true,
    }),
    GridModule,
  ],
  exports:[
    PendingCorrectionAttendanceComponent
  ]
})
export class CorrectionAttendanceModule {}
