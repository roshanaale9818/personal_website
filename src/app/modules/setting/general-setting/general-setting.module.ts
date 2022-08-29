import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GeneralSettingRoutingModule } from "./general-setting-routing.module";
import { SettingComponent } from "./components/setting.component";
import { TabsModule } from "ngx-bootstrap/tabs";
import { CompanyLogoComponent } from "./components/company-logo/company-logo.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "@app/shared/shared.module";
import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/admin/", ".json");
}

@NgModule({
  declarations: [SettingComponent, CompanyLogoComponent],
  imports: [
    CommonModule,
    GeneralSettingRoutingModule,
    TabsModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    DropDownsModule,
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
export class GeneralSettingModule {}
