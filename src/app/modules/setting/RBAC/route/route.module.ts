import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RouteRoutingModule } from "./route-routing.module";
import { RouteComponent } from "./components/route/route.component";
import { SharedModule } from "@app/shared/shared.module";

@NgModule({
  declarations: [RouteComponent],
  imports: [CommonModule, RouteRoutingModule, SharedModule],
})
export class RouteModule {}
