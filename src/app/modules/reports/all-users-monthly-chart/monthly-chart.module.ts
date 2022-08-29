import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MonthlyChartRoutingModule } from "./monthly-chart-routing.module";

// import { DayNumberPipe } from "./../../../shared/services/pipes/daynumber.pipe";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "@app/shared/shared.module";
import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
// import { NpDatepickerModule } from "angular-nepali-datepicker";
import { ExcelExportModule } from "@progress/kendo-angular-excel-export";

// import {
//   GridModule,
//   PDFModule,
//   ExcelModule
// } from "@progress/kendo-angular-grid";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/admin/", ".json");
}
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MonthlyChartRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    // GridModule,
    // PDFModule,
    // ExcelModule,
    // ExcelExportModule,
    // NpDatepickerModule,

    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      },
      isolate: true
    })
  ]
})
export class MonthlyChartModule {}
