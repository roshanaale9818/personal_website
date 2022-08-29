import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PayrollPeriodsComponent } from './components/payroll-periods/payroll-periods.component';
// import { PayrollPeriodsComponent } from '../payroll/components/payroll-periods/payroll-periods.component';

const routes: Routes = [
  {
    path:"",
    component:PayrollPeriodsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayrollPeriodRoutingModule { }
