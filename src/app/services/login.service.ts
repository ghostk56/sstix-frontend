import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UsersService } from './users.service';

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

  autoLogin() {
    let token = localStorage.getItem('token');
    if (token) {
      this.usersService.validated(token).subscribe({
        next: (result) => {
          if (result.returnCode == '00000') {
            this.loggedIn();
            if (result.data.level == 2) {
              this.loggedAdmin();
            }
          }
        },
        error: () => {
          this.loggedOut();
        },
        complete: () => {},
      });
    }
  }

  constructor(private usersService: UsersService) {}
}
