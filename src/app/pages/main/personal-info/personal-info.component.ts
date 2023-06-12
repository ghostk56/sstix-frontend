import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { SHARED_ZORRO_MODULES } from 'src/app/common/modules/shared-zorro.module';
import { LoginService } from 'src/app/services/login.service';
import { UsersService } from 'src/app/services/users.service';
import { UsersInfoResponse } from '../../../models/users-info-response';

@Component({
  selector: 'app-personal-info',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SHARED_ZORRO_MODULES,
  ],
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.css'],
})
export class PersonalInfoComponent implements OnInit {
  userData!: UsersInfoResponse;
  userDataLoaded = false;

  toOrderHistory() {
    this.router.navigate(['/order-history']);
  }

  loggedOut() {
    this.loginService.loggedOut();
    this.router.navigate(['/login']);
  }

  constructor(
    private usersService: UsersService,
    private modalService: NzModalService,
    private router: Router,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    let token = localStorage.getItem('token');
    if (token) {
      this.usersService.userInfo(token).subscribe({
        next: (result) => {
          if (result.returnCode == '00000') {
            this.userData = result.data;
            this.userDataLoaded = true;
          }
        },
        error: (result) => {
          if (result.status == 403) {
            this.modalService.success({
              nzTitle: result.error.returnMsg,
              nzContent: '登入驗證錯誤!',
              nzOnOk: () => {
                this.loggedOut();
              },
            });
          }
        },
        complete: () => {},
      });
    } else {
      this.loggedOut();
    }
  }
}
