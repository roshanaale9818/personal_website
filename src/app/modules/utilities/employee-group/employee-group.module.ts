import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { EmployeeGroupListComponent } from "./components/employee-group-list/employee-group-list.component";
import { EmployeeGroupRoutingModule } from "./employee-group-routing.module";
import { GridModule } from "@progress/kendo-angular-grid";
import { SharedModule } from "@app/shared/shared.module";

@NgModule({
  declarations: [EmployeeGroupListComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EmployeeGroupRoutingModule,
    SharedModule,
    GridModule
  ]
})
export class EmployeeGroupModule {}
