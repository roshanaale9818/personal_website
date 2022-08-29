import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RoleGuard } from "@app/core/guards/role.guard";

import { RequestReceivedComponent } from "./components/request-received/request-received.component";

const routes: Routes = [
  { path: "", component: RequestReceivedComponent, canActivate: [RoleGuard] },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestReceivedRoutingModule {}
