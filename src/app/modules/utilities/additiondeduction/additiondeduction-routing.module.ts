import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RoleGuard } from "@app/core/guards/role.guard";

import { AdditionDeductionComponent } from "./components/additiondeduction.component";

const routes: Routes = [{ path: "", component: AdditionDeductionComponent,
canActivate:[RoleGuard] }];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdditionDeductionRoutingModule {}
