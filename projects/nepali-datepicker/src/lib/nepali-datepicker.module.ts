import { NgModule } from "@angular/core";
import { NepaliDatepickerComponent } from "./nepali-datepicker.component";
import { ToNpPipe } from "./nepali-datepicker.component";
import { CommonModule } from "@angular/common";
import { OverlayModule } from "@angular/cdk/overlay";

@NgModule({
  declarations: [NepaliDatepickerComponent, ToNpPipe],
  imports: [CommonModule, OverlayModule],
  exports: [NepaliDatepickerComponent]
})
export class NepaliDatepickerModule {}
