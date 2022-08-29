import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GridModule } from "@progress/kendo-angular-grid";
import { SharedModule } from "@app/shared/shared.module";
import { TaxSlabRoutingModule } from "./tax-slab-routing.module";
import { TaxSlabListComponent } from "./components/tax-slab-list/tax-slab-list.component";
import { CustomPipeForDatePickerPipe } from './components/pipe/custom-pipe-for-date-picker.pipe';

@NgModule({
  declarations: [TaxSlabListComponent, CustomPipeForDatePickerPipe],
  imports: [
    CommonModule,
    FormsModule,
    TaxSlabRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    GridModule
  ]
})
export class TaxSlabModule {}
