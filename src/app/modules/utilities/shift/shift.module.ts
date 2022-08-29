import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ShiftRoutingModule } from "./shift-routing.module";
import { ShiftComponent } from "./components/shift.component";
import { ListShiftComponent } from "./components/list-shift/list-shift.component";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "@app/shared/shared.module";
import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";

import { GridModule } from "@progress/kendo-angular-grid";
import { IntlModule } from "@progress/kendo-angular-intl";
import { DateInputsModule } from "@progress/kendo-angular-dateinputs";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/admin/", ".json");
}

@NgModule({
  declarations: [ShiftComponent, ListShiftComponent],
  imports: [
    CommonModule,
    ShiftRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    GridModule,
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
})
export class ShiftModule {}
