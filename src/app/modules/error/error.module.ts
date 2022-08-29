import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ErrorRoutingModule } from "./error-routing.module";
import { ErrorComponent } from "./components/error.component";
import { RouteErrorComponent } from './components/504-error/route-error.component';

@NgModule({
  declarations: [ErrorComponent, RouteErrorComponent],
  imports: [CommonModule, ErrorRoutingModule]
})
export class ErrorModule {}
