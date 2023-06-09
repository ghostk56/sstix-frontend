import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SHARED_ZORRO_MODULES } from '../../common/modules/shared-zorro.module';
import { Route, Router, RouterModule } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';

@Component({
  standalone: true,
  selector: 'app-admin',
  imports: [CommonModule, RouterModule, SHARED_ZORRO_MODULES,NzPopconfirmModule],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent {
  constructor(public loginService: LoginService, private router: Router) {}

  loggedOut() {
    this.loginService.loggedOut();
    this.router.navigate(['/login']);
  }
}
