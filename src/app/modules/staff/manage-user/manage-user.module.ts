import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ManageUserRoutingModule } from "./manage-user-routing.module";
import { ManageUserComponent } from "./components/manage-user/manage-user.component";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "@app/shared/shared.module";
import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";

import { GridModule } from "@progress/kendo-angular-grid";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { InputsModule } from "@progress/kendo-angular-inputs";
import { AddDeviceIdComponent } from "./components/manage-user/add-device-id/add-device-id.component";
import { AssignRoleComponent } from "./components/manage-user/assign-role/assign-role.component";
import { PopoverModule } from "ngx-bootstrap";
import { ArchiveUserComponent } from "./components/manage-user/archive-user/archive-user.component";
import { ActiveUserComponent } from "./components/manage-user/active-user/active-user.component";
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/admin/", ".json");
}

@NgModule({
  declarations: [
    ManageUserComponent,
    AddDeviceIdComponent,
    AssignRoleComponent,
    ArchiveUserComponent,
    ActiveUserComponent,
  ],
  imports: [
    CommonModule,
    ManageUserRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,

    GridModule,
    DropDownsModule,
    PopoverModule.forRoot(),
    InputsModule,
    SharedModule,

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
export class ManageUserModule {}
