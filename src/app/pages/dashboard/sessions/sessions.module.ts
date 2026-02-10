import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SessionsRoutingModule } from './sessions-routing.module';
import { SessionsComponent } from './sessions.component';
import { SearchableSelectComponent } from '../../../shared/ui/searchable-select/searchable-select.component';


@NgModule({
  declarations: [
    SessionsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SessionsRoutingModule,
    SearchableSelectComponent
  ]
})
export class SessionsModule { }
