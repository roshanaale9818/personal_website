import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RoleGuard } from "@app/core/guards/role.guard";

import { HolidayManagementComponent } from "./components/holiday-management.component";

const routes: Routes = [{ path: "", component: HolidayManagementComponent,canActivate:[RoleGuard] }];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HolidayManagementRoutingModule {}
