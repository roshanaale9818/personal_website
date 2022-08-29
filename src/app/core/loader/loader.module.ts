import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  MatProgressBarModule,
  MatProgressSpinnerModule,
} from "@angular/material";
import { LoaderComponent } from "./component/loader.component";

@NgModule({
  imports: [CommonModule, MatProgressBarModule, MatProgressSpinnerModule],
  exports: [LoaderComponent, MatProgressBarModule],
  declarations: [LoaderComponent],
})
export class LoaderModule {}
