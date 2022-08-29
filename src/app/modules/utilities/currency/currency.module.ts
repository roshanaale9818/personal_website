import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CurrencyRoutingModule } from "./currency-routing.module";
import { CurrencyComponent } from "./components/currency.component";
import { ListCurrencyComponent } from "./components/list-currency/list-currency.component";

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
  declarations: [CurrencyComponent, ListCurrencyComponent],
  imports: [
    CommonModule,
    CurrencyRoutingModule,
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
export class CurrencyModule {}
