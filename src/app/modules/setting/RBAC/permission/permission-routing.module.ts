import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ListPermissionComponent } from "./components/list-permission/list-permission.component";
import { PermissionComponent } from "./components/permission/permission.component";

import { ViewPermissionComponent } from "./components/view-permission/view-permission.component";

const routes: Routes = [
  { path: "", component: ListPermissionComponent },
  {
    path: "add",
    component: PermissionComponent,
  },
  {
    path: "edit/:id",
    component: PermissionComponent,
  },
  {
    path: "view/:id",
    component: ViewPermissionComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PermissionRoutingModule {}
