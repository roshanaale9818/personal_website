import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  NO_ERRORS_SCHEMA,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { MonthlyReportRoutingModule } from "./monthly-report-routing.module";
import { MonthlyReportComponent } from "./components/monthly-report.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "@app/shared/shared.module";
import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { IntlModule } from "@progress/kendo-angular-intl";
import { DateInputsModule } from "@progress/kendo-angular-dateinputs";
import { GridModule } from "@progress/kendo-angular-grid";
import { MonthlyReportDetailsComponent } from "./components/monthly-report-details/monthly-report-details.component";
import { UserwiseMonthlyReportComponent } from "./components/userwise-monthly-report/userwise-monthly-report.component";
import { UserwiseMonthlyReportDetailsComponent } from "./components/userwise-monthly-report/components/userwise-monthly-report-details/userwise-monthly-report-details.component";

// import { IntlModule } from "@progress/kendo-angular-intl";
// import { DateInputsModule } from "@progress/kendo-angular-dateinputs";
// import { NepaliDatepickerModule } from "../../../../../projects/nepali-datepicker/src/public-api";
// import { NpDatepickerModule } from "angular-nepali-datepicker";
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/admin/", ".json");
}

@NgModule({
  declarations: [
    MonthlyReportComponent,
    MonthlyReportDetailsComponent,
    UserwiseMonthlyReportComponent,
    UserwiseMonthlyReportDetailsComponent,
  ],
  imports: [
    CommonModule,
    MonthlyReportRoutingModule,
    SharedModule,
    GridModule,
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
  ],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
})
export class MonthlyReportModule {}
