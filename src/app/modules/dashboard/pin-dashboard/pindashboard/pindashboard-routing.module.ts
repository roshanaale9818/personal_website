import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@app/core/guards/auth/auth.guard';
import { PindashboardComponent } from './components/pindashboard/pindashboard.component';

const routes: Routes = [
  {
    path:'',component:PindashboardComponent,canActivate:[AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PindashboardRoutingModule { }
