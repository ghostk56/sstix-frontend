import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SHARED_ZORRO_MODULES } from '../../common/modules/shared-zorro.module';

@Component({
  standalone: true,
  selector: 'app-admin',
  imports: [CommonModule, RouterModule, SHARED_ZORRO_MODULES],
  template: `
    <nz-layout class="app-layout">
      <nz-sider
        class="menu-sidebar"
        nzCollapsible
        nzWidth="256px"
        nzBreakpoint="md"
        [(nzCollapsed)]="isCollapsed"
        [nzTrigger]="null"
      >
        <div class="sidebar-logo">
          <a routerLink="/welcome">
            <img src="https://ng.ant.design/assets/img/logo.svg" alt="logo" />
            <h1>活動首頁</h1>
          </a>
        </div>
        <ul
          nz-menu
          nzTheme="dark"
          nzMode="inline"
          [nzInlineCollapsed]="isCollapsed"
        >
          <li nz-submenu nzOpen nzTitle="管理員操作" nzIcon="dashboard">
            <ul>
              <li nz-menu-item nzMatchRouter>
                <a routerLink="/admin/admin-events">活動查詢</a>
              </li>
              <li nz-menu-item nzMatchRouter>
                <a routerLink="/admin/admin-orders">訂購紀錄查詢</a>
              </li>
            </ul>
          </li>
        </ul>
      </nz-sider>
      <nz-layout>
        <nz-header>
          <div class="app-header">
            <span class="header-trigger" (click)="isCollapsed = !isCollapsed">
              <span
                class="trigger"
                nz-icon
                [nzType]="isCollapsed ? 'menu-unfold' : 'menu-fold'"
              ></span>
            </span>
          </div>
        </nz-header>
        <nz-content>
          <div class="inner-content">
            <router-outlet></router-outlet>
          </div>
        </nz-content>
      </nz-layout>
    </nz-layout>
  `,
  styles: [
    `
      :host {
        display: flex;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      .app-layout {
        height: 100vh;
      }

      .menu-sidebar {
        position: relative;
        z-index: 10;
        min-height: 100vh;
        box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
      }

      .header-trigger {
        height: 64px;
        padding: 20px 24px;
        font-size: 20px;
        cursor: pointer;
        transition: all 0.3s, padding 0s;
      }

      .trigger:hover {
        color: #1890ff;
      }

      .sidebar-logo {
        position: relative;
        height: 64px;
        padding-left: 24px;
        overflow: hidden;
        line-height: 64px;
        background: #001529;
        transition: all 0.3s;
      }

      .sidebar-logo img {
        display: inline-block;
        height: 32px;
        width: 32px;
        vertical-align: middle;
      }

      .sidebar-logo h1 {
        display: inline-block;
        margin: 0 0 0 20px;
        color: #fff;
        font-weight: 600;
        font-size: 14px;
        font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
        vertical-align: middle;
      }

      nz-header {
        padding: 0;
        width: 100%;
        z-index: 2;
      }

      .app-header {
        position: relative;
        height: 64px;
        padding: 0;
        background: #fff;
        box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
      }

      nz-content {
        margin: 24px;
      }

      .inner-content {
        padding: 24px;
        background: #fff;
        height: 100%;
        overflow: auto;
      }
    `,
  ],
})
export class AdminComponent {
  isCollapsed = false;
}
