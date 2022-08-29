import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";

import { TimeCardComponent } from "./components/time-card.component";
import { TimeCardRoutingModule } from "./time-card-routing.module";
import { SharedModule } from "@app/shared/shared.module";

@NgModule({
  declarations: [TimeCardComponent],
  imports: [CommonModule, TimeCardRoutingModule, SharedModule],
  schemas: [NO_ERRORS_SCHEMA],
})
export class TimeCardModule {}
