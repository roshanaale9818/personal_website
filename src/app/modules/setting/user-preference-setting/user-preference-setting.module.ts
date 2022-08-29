import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { UserPreferenceSettingRoutingModule } from "./user-preference-setting-routing.module";
import { UserPreferenceComponent } from "./components/user-preference.component";
import { SharedModule } from "@app/shared/shared.module";

@NgModule({
  declarations: [UserPreferenceComponent],
  imports: [CommonModule, UserPreferenceSettingRoutingModule, SharedModule],
})
export class UserPreferenceSettingModule {}
