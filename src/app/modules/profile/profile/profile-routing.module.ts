import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PinloginGuard } from '@app/core/guards/auth/pinlogin.guard';
import { ProfileComponent } from './components/profile/profile.component';
import { UpdateProfileComponent } from './components/update-profile/update-profile.component';

const routes: Routes = [
  { path: "", component: ProfileComponent,canActivate:[PinloginGuard] },
  { path: "update", component: UpdateProfileComponent,canActivate:[PinloginGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
