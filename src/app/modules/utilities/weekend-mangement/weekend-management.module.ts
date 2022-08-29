import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { WeekendManagementRoutingModule } from "./weekend-management-routing.module";
import { WeekendManagementComponent } from "./components/weekend-management.component";
import { ListWeekendComponent } from "./components/list-weekend/list-weekend.component";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [WeekendManagementComponent, ListWeekendComponent],
  imports: [
    CommonModule,
    WeekendManagementRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class WeekendManagementModule {}
