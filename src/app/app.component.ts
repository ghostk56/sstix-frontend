import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginService } from './services/login.service';
import { UsersService } from './services/users.service';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(
    private loginService: LoginService,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    let token = localStorage.getItem('token');
    if (token) {
      this.usersService.validated(token).subscribe({
        next: (result) => {
          if (result.returnCode == '00000') {
            this.loginService.loggedIn();
            if (result.data.level == 2) {
              this.loginService.loggedAdmin();
            }
          }
        },
        error: () => {
          this.loginService.loggedOut();
        },
        complete: () => {},
      });
    }
  }
}
