import { RoleGuard } from "./../../core/guards/role.guard";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AuditLogComponent } from "./components/audit-log/audit-log.component";

const routes: Routes = [
  // canActivate: [RoleGuard]
  { path: "", component: AuditLogComponent},
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuditLogRoutingModule {}
