import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RoleGuard } from "@app/core/guards/role.guard";
import { TaxSlabListComponent } from "./components/tax-slab-list/tax-slab-list.component";


const routes: Routes = [
  { path: "", component: TaxSlabListComponent,canActivate:[RoleGuard]}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaxSlabRoutingModule {
  constructor(){
    console.log("inside reouting of taxslab")
  }
}
