import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SessionsAdminComponent } from './sessions-admin/sessions-admin.component';
import { adminGuard } from '../../../core/auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: SessionsAdminComponent,
    canActivate: [adminGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }
