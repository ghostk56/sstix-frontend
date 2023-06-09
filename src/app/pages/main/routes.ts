import { Route } from '@angular/router';
import { AuthGuard } from 'src/app/auth/auth-guard.service';
import { MainComponent } from './main.component';

export const MAIN_ROUTES: Route[] = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: '/welcome' },
      {
        path: 'welcome',
        loadComponent: () =>
          import('./welcome/welcome.component').then(
            (mod) => mod.WelcomeComponent
          ),
      },
      {
        path: 'events',
        loadComponent: () =>
          import('./events/events.component').then(
            (mod) => mod.EventsComponent
          ),
      },
      {
        path: 'events/:id',
        loadComponent: () =>
          import('./events/event/event.component').then(
            (mod) => mod.EventComponent
          ),
      },
      {
        path: 'events/:id/order-form',
        loadComponent: () =>
          import('./events/event/order-form/order-form.component').then(
            (mod) => mod.OrderFormComponent
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./register/register.component').then(
            (mod) => mod.RegisterComponent
          ),
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./login/login.component').then((mod) => mod.LoginComponent),
      },
      {
        path: 'personal-info',
        loadComponent: () =>
          import('./personal-info/personal-info.component').then(
            (mod) => mod.PersonalInfoComponent
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'edit-info',
        loadComponent: () =>
          import('./personal-info/edit-info/edit-info.component').then(
            (mod) => mod.EditInfoComponent
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'order-history',
        loadComponent: () =>
          import('./personal-info/order-history/order-history.component').then(
            (mod) => mod.OrderHistoryComponent
          ),
        canActivate: [AuthGuard],
      },
    ],
  },
];
