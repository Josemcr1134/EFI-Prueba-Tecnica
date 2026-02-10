import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'sessions',
        loadChildren: () => import('./sessions/sessions.module').then(s => s.SessionsModule)
      },
      {
        path: 'administration',
        loadChildren: () => import('./administration/administration.module').then(s => s.AdministrationModule)
      },
      {
        path: '**',
        redirectTo: 'sessions',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
