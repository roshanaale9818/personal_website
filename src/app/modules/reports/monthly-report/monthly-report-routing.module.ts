import { RoleGuard } from "@app/core/guards/role.guard";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { MonthlyReportComponent } from "./components/monthly-report.component";

const routes: Routes = [
  { path: "", component: MonthlyReportComponent, canActivate: [RoleGuard] },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MonthlyReportRoutingModule {}
