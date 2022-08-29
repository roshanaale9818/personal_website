import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RoleGuard } from "@app/core/guards/role.guard";

import { CurrencyComponent } from "./components/currency.component";

const routes: Routes = [{ path: "", component: CurrencyComponent,canActivate:[RoleGuard] }];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CurrencyRoutingModule {}
