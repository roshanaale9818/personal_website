import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ClientEmployeeRoutingModule } from "./client-employee-routing.module";
import { ClientEmployeeComponent } from "./components/client-employee.component";
import { SharedModule } from "@app/shared/shared.module";
import { MatSliderModule } from "@angular/material";

@NgModule({
  declarations: [ClientEmployeeComponent],
  imports: [
    CommonModule,
    ClientEmployeeRoutingModule,
    SharedModule,
    MatSliderModule,
  ],
})
export class ClientEmployeeModule {}
