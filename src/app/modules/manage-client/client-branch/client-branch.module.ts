import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ClientBranchRoutingModule } from "./client-branch-routing.module";
import { ClientBranchComponent } from "./components/client-branch.component";
import { ListClientBranchComponent } from "./components/list-client-branch/list-client-branch.component";
import { AddClientLocationComponent } from "./components/add-client-location/add-client-location.component";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "@app/shared/shared.module";
import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";

import { GridModule } from "@progress/kendo-angular-grid";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { DropDownListModule } from "@progress/kendo-angular-dropdowns";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/admin/", ".json");
}

@NgModule({
  declarations: [
    ClientBranchComponent,
    ListClientBranchComponent,
    AddClientLocationComponent
  ],
  imports: [
    CommonModule,
    ClientBranchRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    GridModule,
    DropDownsModule,
    DropDownListModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      },
      isolate: true
    })
  ],
  exports:[
    AddClientLocationComponent
  ]
})
export class ClientBranchModule {}
