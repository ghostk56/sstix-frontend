import { Route } from '@angular/router';
import { AdminComponent } from './admin.component';

export const ADMIN_ROUTES: Route[] = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: '/admin/admin-events' },
      {
        path: 'admin-events',
        loadComponent: () =>
        import('./admin-events/admin-events.component').then(
          (mod) => mod.AdminEventsComponent)
      },
      {
        path: 'add-event',
        loadComponent: () =>
        import('./admin-events/add-event/add-event.component').then(
          (mod) => mod.AddEventComponent)
      },
      {
        path: 'edit-event/:id',
        loadComponent: () =>
        import('./admin-events/edit-event/edit-event.component').then(
          (mod) => mod.EditEventComponent)
      },
      {
        path: 'admin-orders',
        loadComponent: () =>
        import('./admin-orders/admin-orders.component').then(
          (mod) => mod.AdminOrdersComponent)
      },
    ]
  },
];