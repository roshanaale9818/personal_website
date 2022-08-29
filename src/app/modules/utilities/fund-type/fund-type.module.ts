import { GridModule } from "@progress/kendo-angular-grid";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FundTypeRoutingModule } from "./fund-type-routing.module";
import { FundTypeComponent } from "./components/fund-type.component";
import { SharedModule } from "@app/shared/shared.module";

@NgModule({
  declarations: [FundTypeComponent],
  imports: [CommonModule, FundTypeRoutingModule, SharedModule, GridModule],
})
export class FundTypeModule {}
