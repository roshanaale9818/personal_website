import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PermissionRoutingModule } from "./permission-routing.module";

import { SharedModule } from "@app/shared/shared.module";
import { ViewPermissionComponent } from "./components/view-permission/view-permission.component";
import { ListPermissionComponent } from "./components/list-permission/list-permission.component";
import { PermissionComponent } from './components/permission/permission.component';

@NgModule({
  declarations: [ViewPermissionComponent, ListPermissionComponent, PermissionComponent],
  imports: [CommonModule, PermissionRoutingModule, SharedModule],
})
export class PermissionModule {}
