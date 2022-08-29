import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { HolidayManagementRoutingModule } from "./holiday-management-routing.module";
import { HolidayManagementComponent } from "./components/holiday-management.component";

import { ListHolidayComponent } from "./components/list-holiday/list-holiday.component";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "@app/shared/shared.module";
import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { NpDatepickerModule } from "angular-nepali-datepicker";
import { GridModule } from "@progress/kendo-angular-grid";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/admin/", ".json");
}

@NgModule({
  declarations: [HolidayManagementComponent, ListHolidayComponent],
  imports: [
    CommonModule,
    HolidayManagementRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NpDatepickerModule,
    GridModule,

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
export class HolidayManagementModule {}
