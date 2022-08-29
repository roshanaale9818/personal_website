import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RoleGuard } from "@app/core/guards/role.guard";

import { EmployeeTypeComponent } from "./components/employee-type.component";

const routes: Routes = [{ path: "", component: EmployeeTypeComponent,canActivate:[RoleGuard] }];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeTypeRoutingModule {}
