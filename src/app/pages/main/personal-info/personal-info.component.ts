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
  template: `
    <div nz-col nzSpan="10">
      <h1>個人信息</h1>
      <nz-card
        style="width: 500px"
        nzTitle="基本資訊"
        [nzExtra]="extraTemplate"
      >
        <ul nz-list nzBordered nzSize="large" *ngIf="userDataLoaded">
          <li nz-list-item nzNoFlex>
            <ul nz-list-item-actions>
              <nz-list-item-action>
                {{ userData.userName }}
              </nz-list-item-action>
            </ul>
            帳號
          </li>
          <li nz-list-item nzNoFlex>
            <ul nz-list-item-actions>
              <nz-list-item-action>
                {{ userData.email }}
              </nz-list-item-action>
            </ul>
            Email
          </li>
          <li nz-list-item nzNoFlex>
            <ul nz-list-item-actions>
              <nz-list-item-action>
                {{ userData.phone }}
              </nz-list-item-action>
            </ul>
            電話
          </li>
        </ul>
      </nz-card>
      <ng-template #extraTemplate>
        <a routerLink="/edit-info">修改密碼</a>
      </ng-template>
    </div>
    <br />
    <div nz-row>
      <div nz-col nzSpan="8">
        <button
          nz-button
          nzSize="large"
          nzType="primary"
          (click)="toOrderHistory()"
        >
          查詢訂票紀錄
        </button>
      </div>
      <div nz-col nzSpan="3" nzOffset="13">
        <button nz-button nzSize="large" nzType="primary" (click)="loggedOut()">
          登出
        </button>
      </div>
    </div>
  `,
  styles: [``],
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
