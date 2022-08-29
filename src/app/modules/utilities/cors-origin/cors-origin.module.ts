import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CorsOriginRoutingModule } from './cors-origin-routing.module';
import { CorsOriginListComponent } from './components/cors-origin-list/cors-origin-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { GridModule } from '@progress/kendo-angular-grid';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/admin/", ".json");
}
@NgModule({
  declarations: [CorsOriginListComponent],
  imports: [
    CommonModule,
    CorsOriginRoutingModule,
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
export class CorsOriginModule { }
