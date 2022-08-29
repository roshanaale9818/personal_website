import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { MonthlyChartComponent } from "./components/monthly-chart.component";

const routes: Routes = [{ path: "", component: MonthlyChartComponent }];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonthlyChartRoutingModule {}
