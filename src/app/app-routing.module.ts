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
    loadChildren: () =>
      import('./pages/admin/routes').then(
        (mod) => mod.ADMIN_ROUTES
      ), 
  },
  { path: '**', redirectTo: '/welcome' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
