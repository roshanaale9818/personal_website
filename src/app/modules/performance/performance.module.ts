import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerformanceRoutingModule } from './performance-routing.module';
import { PerformanceComponent } from './components/performance/performance.component';
import { SharedModule } from '@app/shared/shared.module';
import { PerformanceListComponent } from './components/performance-list/performance-list.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { PopoverModule } from 'ngx-bootstrap';
import { InputsModule } from '@progress/kendo-angular-inputs';
// import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { CreatePerformanceComponent } from './components/create-performance/create-performance.component';


@NgModule({
  declarations: [PerformanceComponent,PerformanceListComponent, CreatePerformanceComponent],
  imports: [
  CommonModule,
    PerformanceRoutingModule,
    SharedModule,
    GridModule,
    DropDownsModule,
    PopoverModule.forRoot(),
    InputsModule,
    SharedModule,

    // TranslateModule.forChild({
    //   loader: {
    //     provide: TranslateLoader,
    //     useFactory: createTranslateLoader,
    //     deps: [HttpClient],
    //   },
    //   isolate: true,
    // }),
  ]
})
export class PerformanceModule {
  constructor(){
    console.log("Performance called")
  }
 }
