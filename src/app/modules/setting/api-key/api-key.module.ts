import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ApiKeyRoutingModule } from "./api-key-routing.module";
import { ApiKeyComponent } from "./components/api-key.component";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NpDatepickerModule } from "angular-nepali-datepicker";
import { SharedModule } from "@app/shared/shared.module";
import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { GridModule } from "@progress/kendo-angular-grid";
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/admin/", ".json");
}

@NgModule({
  declarations: [ApiKeyComponent],
  imports: [
    CommonModule,
    ApiKeyRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NpDatepickerModule,
    SharedModule,

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
export class ApiKeyModule {}
