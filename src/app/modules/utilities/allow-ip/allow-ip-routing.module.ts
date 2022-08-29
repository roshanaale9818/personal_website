import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RoleGuard } from "@app/core/guards/role.guard";

import { AllowIpComponent } from "./components/allow-ip.component";

const routes: Routes = [{ path: "", component: AllowIpComponent,canActivate:[RoleGuard] }];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllowIpRoutingModule {}
