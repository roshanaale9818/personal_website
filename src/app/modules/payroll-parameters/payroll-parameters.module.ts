import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PayrollParametersRoutingModule } from './payroll-parameters-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridModule } from '@progress/kendo-angular-grid';
import { PayrollParametersComponent } from './components/payroll-parameters/payroll-parameters.component';

import { AssignEmployeesComponent } from './components/assign-employees/assign-employees.component';

@NgModule({
  declarations: [
    PayrollParametersComponent,
    AssignEmployeesComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    PayrollParametersRoutingModule,


  ]
})
export class PayrollParametersModule { }
