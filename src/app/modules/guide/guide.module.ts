import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "@app/shared/shared.module";
import { GridModule } from "@progress/kendo-angular-grid";
import { GuideComponent } from './components/guide/guide.component';
import { GuideRoutingModule } from "./guide-routing.module";
import { WeekendManagementModule } from "../utilities/weekend-mangement/weekend-management.module";
import { TopbarComponent } from "./components/topbar/topbar.component";


@NgModule({
  declarations: [GuideComponent,TopbarComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    GuideRoutingModule,
    WeekendManagementModule
  ],
  exports:[
    GuideComponent
  ]
})
export class GuideModule {}
