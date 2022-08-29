import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AuditLogRoutingModule } from "./audit-log-routing.module";
import { AuditLogComponent } from "./components/audit-log/audit-log.component";
import { SharedModule } from "@app/shared/shared.module";

@NgModule({
  declarations: [AuditLogComponent],
  imports: [CommonModule, AuditLogRoutingModule, SharedModule],
})
export class AuditLogModule {}
