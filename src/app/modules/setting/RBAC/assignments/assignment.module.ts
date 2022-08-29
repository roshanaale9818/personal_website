import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AssignmentComponent } from "./components/assignment/assignment.component";
import { AssignmentRoutingModule } from "./assignment-routing.module";
import { SharedModule } from "@app/shared/shared.module";
import { ViewAssignmentComponent } from "./components/view-assignment/view-assignment.component";
import { InputsModule } from "@progress/kendo-angular-inputs";

@NgModule({
  declarations: [AssignmentComponent, ViewAssignmentComponent],
  imports: [CommonModule, AssignmentRoutingModule, SharedModule, InputsModule],
})
export class AssignmentModule {}
