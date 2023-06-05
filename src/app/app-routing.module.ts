import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminAuthGuard } from './auth/admin-auth-guard.service';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/main/routes').then((mod) => mod.MAIN_ROUTES),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./pages/admin/routes').then((mod) => mod.ADMIN_ROUTES),
    canActivate: [AdminAuthGuard],
  },
  { path: '**', redirectTo: '/welcome' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
