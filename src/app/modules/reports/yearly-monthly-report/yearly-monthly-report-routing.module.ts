import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { YearlyMonthlyReportComponent } from "./components/yearly-monthly-report.component";

const routes: Routes = [{ path: "", component: YearlyMonthlyReportComponent }];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class YearlyMonthlyReportRoutingModule {}
