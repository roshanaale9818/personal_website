import { SharedModule } from "./../../../shared/shared.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CreateRequestComponent } from "./components/create-request/create-request.component";
import { CreateRequestRoutingModule } from "./create-request-routing.module";
import { NpDatepickerModule } from "angular-nepali-datepicker";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import { DateInputsModule } from "@progress/kendo-angular-dateinputs";

@NgModule({
  declarations: [CreateRequestComponent],
  imports: [
    CommonModule,
    CreateRequestRoutingModule,
    NpDatepickerModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    DateInputsModule
  ]
})
export class CreateRequestModule {}
