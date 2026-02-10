import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministrationRoutingModule } from './administration-routing.module';
import { SessionsAdminComponent } from './sessions-admin/sessions-admin.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AdministrationRoutingModule,
    SessionsAdminComponent
  ]
})
export class AdministrationModule { }
