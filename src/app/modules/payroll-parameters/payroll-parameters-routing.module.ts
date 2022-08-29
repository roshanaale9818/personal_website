import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PayrollParametersComponent } from './components/payroll-parameters/payroll-parameters.component';

const routes: Routes = [
  {
    path:"",
    component:PayrollParametersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayrollParametersRoutingModule { }
