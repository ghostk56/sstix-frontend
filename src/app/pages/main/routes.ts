import { Route } from '@angular/router';
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
        path: 'register',
        loadComponent: () =>
        import('./register/register.component').then(
          (mod) => mod.RegisterComponent
        ), 
      },
      {
        path: 'login',
        loadComponent: () =>
        import('./login/login.component').then(
          (mod) => mod.LoginComponent
        ), 
      },
      {
        path: 'personal-info',
        loadComponent: () =>
        import('./personal-info/personal-info.component').then(
          (mod) => mod.PersonalInfoComponent
        ), 
      },
      {
        path: 'edit-info',
        loadComponent: () =>
        import('./personal-info/edit-info/edit-info.component').then(
          (mod) => mod.EditInfoComponent
        ), 
      },
    ]
  },
];