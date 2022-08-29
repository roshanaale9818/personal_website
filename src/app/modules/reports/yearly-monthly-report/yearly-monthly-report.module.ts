import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { YearlyMonthlyReportRoutingModule } from "./yearly-monthly-report-routing.module";
import { YearlyMonthlyReportComponent } from "./components/yearly-monthly-report.component";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "@app/shared/shared.module";
import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { NpDatepickerModule } from "angular-nepali-datepicker";
import { ExcelExportModule } from "@progress/kendo-angular-excel-export";

import {
  GridModule,
  PDFModule,
  ExcelModule
} from "@progress/kendo-angular-grid";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/admin/", ".json");
}
@NgModule({
  declarations: [YearlyMonthlyReportComponent],
  imports: [
    CommonModule,
    YearlyMonthlyReportRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    PDFModule,
    ExcelModule,
    ExcelExportModule,
    NpDatepickerModule,

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
export class YearlyMonthlyReportModule {}
