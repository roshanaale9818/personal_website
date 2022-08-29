import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MenuManagementRoutingModule } from "./menu-management-routing.module";
import { MenuManagementComponent } from "./components/menu-management/menu-management.component";
import { SharedModule } from "@app/shared/shared.module";

@NgModule({
  declarations: [MenuManagementComponent],
  imports: [CommonModule, MenuManagementRoutingModule, SharedModule],
})
export class MenuManagementModule {}
