import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UsersLoginRequest } from 'src/app/models/users-login-request';
import { LoginService } from 'src/app/services/login.service';
import { UsersService } from 'src/app/services/users.service';
import { SHARED_ZORRO_MODULES } from '../../../common/modules/shared-zorro.module';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SHARED_ZORRO_MODULES,
  ],
  template: `
    <div nz-row class="center-div">
      <div nz-col nzSpan="10">
        <h1>登入</h1>
        <form
          nz-form
          [formGroup]="validateForm"
          class="login-form"
          (ngSubmit)="submitForm()"
        >
          <nz-form-item>
            <nz-form-control nzErrorTip="請輸入使用者名稱!">
              <nz-input-group nzPrefixIcon="user">
                <input
                  type="text"
                  nz-input
                  formControlName="userName"
                  placeholder="使用者名稱"
                />
              </nz-input-group>
            </nz-form-control>
          </nz-form-item>
          <nz-form-item>
            <nz-form-control nzErrorTip="請輸入密碼!">
              <nz-input-group nzPrefixIcon="lock">
                <input
                  type="password"
                  nz-input
                  formControlName="password"
                  placeholder="密碼"
                />
              </nz-input-group>
            </nz-form-control>
          </nz-form-item>
          <button
            nz-button
            class="login-form-button login-form-margin"
            [nzType]="'primary'"
          >
            登入
          </button>
          新用戶
          <a routerLink="/register">註冊!</a>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .login-form {
        max-width: 300px;
      }

      .login-form-margin {
        margin-bottom: 16px;
      }

      .login-form-forgot {
        float: right;
      }

      .login-form-button {
        width: 100%;
      }

      .center-div {
        display: flex;
        justify-content: center;
        width: 1000px;
      }
    `,
  ],
})
export class LoginComponent {
  validateForm!: UntypedFormGroup;

  submitForm(): void {
    if (this.validateForm.valid) {
      const userName = this.validateForm.get('userName')?.value;
      const password = this.validateForm.get('password')?.value;
      let loginRequest: UsersLoginRequest = {
        userName: userName,
        password: password,
      };
      this.usersService.login(loginRequest).subscribe({
        next: (result) => {
          if (result.returnCode == '00000') {
            localStorage.setItem('token', result.data.token);
            this.loginService.loggedIn();
            if (result.data.level == 2) {
              this.loginService.loggedAdmin();
            } else {
              this.loginService.loggedOutAdmin();
            }
            this.modalService.success({
              nzTitle: '登入成功',
              nzContent: '跳轉頁面',
              nzOnOk: () => {
                this.router.navigate(['/personal-info']);
              },
            });
          }
        },
        error: (result) => {
          if (result.status == 403) {
            this.modalService.success({
              nzTitle: result.error.returnMsg,
              nzContent: '請確認帳號密碼!',
              nzOnOk: () => {},
            });
            return;
          }
        },
        complete: () => {},
      });
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  constructor(
    private fb: UntypedFormBuilder,
    private usersService: UsersService,
    private modalService: NzModalService,
    private router: Router,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true],
    });
  }
}
