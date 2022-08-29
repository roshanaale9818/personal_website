import { CollapseModule } from "ngx-bootstrap/collapse";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "@app/shared/shared.module";
import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { IntlModule } from "@progress/kendo-angular-intl";
import { DateInputsModule } from "@progress/kendo-angular-dateinputs";
import { PindashboardRoutingModule } from './pindashboard-routing.module';
import { PindashboardComponent } from './components/pindashboard/pindashboard.component';
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/admin/", ".json");
}


@NgModule({
  declarations: [PindashboardComponent],
  imports: [
    CommonModule,
    PindashboardRoutingModule,
    CollapseModule.forRoot(),
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    IntlModule,
    DateInputsModule,
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
export class PindashboardModule { }
