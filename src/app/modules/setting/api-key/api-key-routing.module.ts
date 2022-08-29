import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ApiKeyComponent } from "./components/api-key.component";

const routes: Routes = [{ path: "", component: ApiKeyComponent }];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApiKeyRoutingModule {}
