import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CorsOriginListComponent } from './components/cors-origin-list/cors-origin-list.component';

const routes: Routes = [
  {
    path:'',
    component:CorsOriginListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CorsOriginRoutingModule { }
