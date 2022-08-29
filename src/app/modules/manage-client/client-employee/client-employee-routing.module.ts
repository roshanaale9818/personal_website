import { RoleGuard } from "@app/core/guards/role.guard";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ClientEmployeeComponent } from "./components/client-employee.component";

const routes: Routes = [
  {
    path: "",
    component: ClientEmployeeComponent,
    canActivate: [RoleGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientEmployeeRoutingModule {}
