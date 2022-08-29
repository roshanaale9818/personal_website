import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from './layout/layout.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
 
import { ToastrModule } from 'ngx-toastr';
import { LoaderModule } from './loader/loader.module';
@NgModule({
  declarations: [],
  imports: [
    LoaderModule,
    CommonModule,
    LayoutModule,
    HttpClientModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot() // ToastrModule added
  ],
  exports: [
    LayoutModule,
    LoaderModule
  ]
})
export class CoreModule { }
