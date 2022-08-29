import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { LeaveTypeRoutingModule } from "./leave-type-routing.module";
import { LeaveTypeComponent } from "./components/leave-type.component";
import { ListLeaveTypeComponent } from "./components/list-leave-type/list-leave-type.component";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "@app/shared/shared.module";
import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { NgxPaginationModule } from "ngx-pagination";
import { GridModule } from "@progress/kendo-angular-grid";
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/admin/", ".json");
}

@NgModule({
  declarations: [LeaveTypeComponent, ListLeaveTypeComponent],
  imports: [
    CommonModule,
    LeaveTypeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxPaginationModule,
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
export class LeaveTypeModule {}
