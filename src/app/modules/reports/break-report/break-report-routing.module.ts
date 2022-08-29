import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { BreakReportComponent } from "./components/break-report.component";

const routes: Routes = [
  {
    path: "",
    component: BreakReportComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BreakReportRoutingModule {}
