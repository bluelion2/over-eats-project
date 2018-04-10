import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserComponent } from './user.component';
import { AuthGuard } from '../auth/services/auth.guard';


const routes: Routes = [
  { path: 'user', component: UserComponent, canActivate: [AuthGuard], pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
