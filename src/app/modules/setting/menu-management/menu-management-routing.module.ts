import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { MenuManagementComponent } from "./components/menu-management/menu-management.component";

const routes: Routes = [{ path: "", component: MenuManagementComponent }];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuManagementRoutingModule {}
