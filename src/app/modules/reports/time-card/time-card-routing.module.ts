import { RoleGuard } from "./../../../core/guards/role.guard";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { TimeCardComponent } from "./components/time-card.component";

const routes: Routes = [
  { path: "", component: TimeCardComponent, canActivate: [RoleGuard] },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimeCardRoutingModule {}
