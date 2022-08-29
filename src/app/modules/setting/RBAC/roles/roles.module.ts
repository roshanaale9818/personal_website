import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RolesRoutingModule } from "./roles-routing.module";
import { RolesComponent } from "./components/roles/roles.component";
import { ListRolesComponent } from "./components/list-roles/list-roles.component";
import { ViewRolesComponent } from "./components/view-roles/view-roles.component";
import { SharedModule } from "@app/shared/shared.module";

@NgModule({
  declarations: [RolesComponent, ListRolesComponent, ViewRolesComponent],
  imports: [CommonModule, RolesRoutingModule, SharedModule],
})
export class RolesModule {}
