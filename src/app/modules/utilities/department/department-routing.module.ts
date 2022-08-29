import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RoleGuard } from "@app/core/guards/role.guard";

import { DepartmentComponent } from "./components/department.component";

const routes: Routes = [{ path: "", component: DepartmentComponent,
canActivate:[RoleGuard] }];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartmentRoutingModule {}
