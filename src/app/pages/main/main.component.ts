import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { LoginService } from 'src/app/services/login.service';
import { SHARED_ZORRO_MODULES } from '../../common/modules/shared-zorro.module';

@Component({
  standalone: true,
  selector: 'app-admin',
  imports: [
    CommonModule,
    RouterModule,
    SHARED_ZORRO_MODULES,
    NzPopconfirmModule,
  ],
  template: `
    <nz-layout>
      <nz-header>
        <a routerLink="/welcome">
          <div class="logo"></div>
        </a>
        <ul nz-menu nzTheme="dark" nzMode="horizontal">
          <li nz-menu-item><a routerLink="/welcome">首頁</a></li>
          <li nz-menu-item><a routerLink="/events">探索活動</a></li>
          <li nz-menu-item *ngIf="loginService.getLoggedStatus() | async">
            <a routerLink="/personal-info"
              ><span nz-icon nzType="user" nzTheme="outline"></span> 資訊</a
            >
          </li>
          <li nz-menu-item *ngIf="!(loginService.getLoggedStatus() | async)">
            <a routerLink="/register">註冊</a>
          </li>
          <li nz-menu-item *ngIf="!(loginService.getLoggedStatus() | async)">
            <a routerLink="/login">登入</a>
          </li>
          <li nz-menu-item *ngIf="loginService.getAdminStatus() | async">
            <a routerLink="/admin">管理頁面</a>
          </li>
          <li
            nz-menu-item
            *ngIf="loginService.getLoggedStatus() | async"
            nz-popconfirm
            nzPopconfirmTitle="確定登出?"
            nzPopconfirmPlacement="bottom"
            (nzOnConfirm)="loggedOut()"
          >
            <span
              nz-icon
              nzType="logout"
              nzTheme="outline"
              style="font-size: 20px"
            ></span>
            登出
          </li>
        </ul>
      </nz-header>
      <nz-content>
        <div class="container">
          <div class="inner-content">
            <router-outlet></router-outlet>
          </div>
        </div>
      </nz-content>
      <nz-footer>SSTIX ©2023 All Rights Reserved</nz-footer>
    </nz-layout>
  `,
  styles: [
    `
      .layout {
        min-height: 100vh;
      }

      .logo {
        width: 120px;
        height: 31px;
        background: rgba(255, 255, 255, 0.2);
        margin: 16px 24px 16px 0;
        float: left;
      }

      nz-header {
        position: absolute;
        width: 100%;
      }

      [nz-menu] {
        line-height: 64px;
      }

      nz-content {
        padding: 0 50px;
        margin-top: 64px;
      }

      nz-breadcrumb {
        margin: 16px 0;
      }

      .inner-content {
        background: #fff;
        padding: 24px;
        min-height: 800px;
        max-width: 1100px;
      }

      .container {
        display: flex;
        justify-content: center;
      }

      nz-footer {
        text-align: center;
      }
    `,
  ],
})
export class MainComponent {
  constructor(public loginService: LoginService, private router: Router) {}

  loggedOut() {
    this.loginService.loggedOut();
    this.router.navigate(['/login']);
  }
}
