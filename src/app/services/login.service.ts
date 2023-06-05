import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  logged$ = new BehaviorSubject<boolean>(false);
  admin$ = new BehaviorSubject<boolean>(false);

  loggedAdmin() {
    this.admin$.next(true);
  }

  loggedOutAdmin() {
    this.admin$.next(false);
  }

  getAdminStatus() {
    return this.admin$.asObservable();
  }

  loggedIn() {
    this.logged$.next(true);
  }

  loggedOut() {
    this.logged$.next(false);
    this.admin$.next(false);
    localStorage.clear();
  }

  getLoggedStatus() {
    return this.logged$.asObservable();
  }

  autoLogin() {}

  constructor() {}
}
