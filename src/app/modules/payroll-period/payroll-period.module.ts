import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PayrollPeriodRoutingModule } from './payroll-period-routing.module';
import { PayrollPeriodsComponent } from './components/payroll-periods/payroll-periods.component';
import { SharedModule } from '@app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridModule } from '@progress/kendo-angular-grid';

@NgModule({
  declarations: [
    PayrollPeriodsComponent
  ],
  imports: [
    CommonModule,
    PayrollPeriodRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
  ]
})
export class PayrollPeriodModule { }
