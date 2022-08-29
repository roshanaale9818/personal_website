import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PayrollHistoryComponent } from './components/payroll-history/payroll-history.component';
import { MonthlyPayrollComponent } from "./components/monthly-payroll/monthly-payroll.component";
import { PayrollDetailComponent } from "./components/payroll-detail/payroll-detail.component";
import { PayrollViewComponent } from "./components/payroll-view/payrollview.component";
// import { PayrollPeriodsComponent } from "./components/payroll-periods/payroll-periods.component";
// import { PayrollParametersComponent } from "./components/payroll-parameters/payroll-parameters.component";
const routes: Routes = [
  {
  path:'monthly',
  component:MonthlyPayrollComponent,
  // data:{
  //   breadcumb:"Monthly Payroll"
  // }
},
{
  path:'history',
  component:PayrollHistoryComponent,
  // data:{
  //   breadcumb:"History"
  // }
},
{
  path:'payroll-detail/:id',
  component:PayrollDetailComponent
},
// {
//   path:"payroll-periods",
//   component:PayrollPeriodsComponent,
//   data:{
//     hello:"Payroll Periods"
//   }
// },
// {
//   path:"payroll-parameters",
//   component:PayrollParametersComponent,
//   data:{
//     hello:"Payroll Parameters"
//   }
// },

{
path:"view",
component:PayrollViewComponent
},
{
  path:'',
  redirectTo:"monthly",
  pathMatch:"full"
},


];
@NgModule({
  imports: [RouterModule.forChild(routes)],

exports: [RouterModule]
})
export class PayrollRoutingModule {
  constructor(){

  }
}
