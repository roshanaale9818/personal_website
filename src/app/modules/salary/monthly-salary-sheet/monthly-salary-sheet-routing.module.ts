import { SearchPayrollComponent } from "./components/search-payroll/search-payroll.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { MonthlySalarySheetComponent } from "./components/monthly-salary-sheet/monthly-salary-sheet.component";

const routes: Routes = [
  {
    path: "",
    component: SearchPayrollComponent,
  },
  { path: "monthly-payroll", component: MonthlySalarySheetComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MonthlySalarySheetRoutingModule {}
