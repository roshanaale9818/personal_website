import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RoleGuard } from "@app/core/guards/role.guard";

import { AllowanceComponent } from "./components/allowance.component";

const routes: Routes = [{ path: "", component: AllowanceComponent,canActivate:[RoleGuard] }];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllowanceRoutingModule {}
