import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RequestReceivedComponent } from "./components/request-received/request-received.component";
import { RequestReceivedRoutingModule } from "./request-received-routing.module";
import { SharedModule } from "./../../../shared/shared.module";

import { GridModule } from "@progress/kendo-angular-grid";
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { InputsModule } from "@progress/kendo-angular-inputs";
import { DeclinedRequestComponent } from "./components/declined-request/declined-request.component";
import { ApprovedRequestComponent } from "./components/approved-request/approved-request.component";
import { PendingRequestComponent } from "./components/pending-request/pending-request.component";
@NgModule({
  declarations: [
    RequestReceivedComponent,
    PendingRequestComponent,
    DeclinedRequestComponent,
    ApprovedRequestComponent,
  ],
  imports: [
    CommonModule,
    RequestReceivedRoutingModule,
    GridModule,
    SharedModule,
    DropDownsModule,
    InputsModule,
  ],
})
export class RequestReceivedModule {}
