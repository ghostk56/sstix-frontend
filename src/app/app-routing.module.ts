import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/main/routes').then(
        (mod) => mod.MAIN_ROUTES
      )
  },
  { 
    path: 'admin', 
    loadComponent: () =>
      import('./pages/admin/admin.component').then(
        (mod) => mod.AdminComponent
      ), 
  },
  { path: '**', redirectTo: '/welcome' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
