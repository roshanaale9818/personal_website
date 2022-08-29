import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RoleGuard } from "@app/core/guards/role.guard";

import { CreateRequestComponent } from "./components/create-request/create-request.component";

const routes: Routes = [
  { path: "", component: CreateRequestComponent, canActivate: [RoleGuard] },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateRequestRoutingModule {}
