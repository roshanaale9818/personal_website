import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdditionDeductionRoutingModule } from "./additiondeduction-routing.module";
import { AdditionDeductionComponent, } from "./components/additiondeduction.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "@app/shared/shared.module";
import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";

import { GridModule } from "@progress/kendo-angular-grid";
import { AdditionDeductionListComponent } from "./components/additiondeduction-list/additiondeduction-list.component";
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/admin/", ".json");
}

@NgModule({
  declarations: [AdditionDeductionComponent, AdditionDeductionListComponent],
  imports: [
    CommonModule,
    AdditionDeductionRoutingModule,
    FormsModule,
    ReactiveFormsModule,
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
export class AdditionDeductionModule {}
