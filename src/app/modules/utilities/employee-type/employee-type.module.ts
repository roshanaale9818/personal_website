import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { EmployeeTypeRoutingModule } from "./employee-type-routing.module";
import { EmployeeTypeComponent } from "./components/employee-type.component";
import { ListEmployeeTypeComponent } from "./components/list-employee-type/list-employee-type.component";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "@app/shared/shared.module";
import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";

import { GridModule } from "@progress/kendo-angular-grid";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/admin/", ".json");
}

@NgModule({
  declarations: [EmployeeTypeComponent, ListEmployeeTypeComponent],
  imports: [
    CommonModule,
    EmployeeTypeRoutingModule,
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
export class EmployeeTypeModule {}
