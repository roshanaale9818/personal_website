import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreatePerformanceComponent } from './components/create-performance/create-performance.component';
import { PerformanceListComponent } from './components/performance-list/performance-list.component';
import { PerformanceComponent } from './components/performance/performance.component';

const routes: Routes = [
  {
    path:'view',
    component:PerformanceComponent
  },
  {
    path:'update',
    component:PerformanceComponent,
    data:{
      breadcrumb:"Update Performance"
    }
  },
  {
    path:'add',
    component:CreatePerformanceComponent,
    data:{
      breadcrumb:"Create Performacne"
    }
  },
  {
    path:'',
    component:PerformanceListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerformanceRoutingModule { }
