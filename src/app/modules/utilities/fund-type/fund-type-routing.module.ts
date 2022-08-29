import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RoleGuard } from "@app/core/guards/role.guard";
import { FundTypeComponent } from "./components/fund-type.component";

const routes: Routes = [
  {
    path: "",
    component: FundTypeComponent,
    canActivate:[RoleGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FundTypeRoutingModule {}
