import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UsersRegisterRequest } from 'src/app/models/users-register-request';
import { LoginService } from 'src/app/services/login.service';
import { UsersService } from 'src/app/services/users.service';
import { SHARED_ZORRO_MODULES } from '../../../common/modules/shared-zorro.module';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, SHARED_ZORRO_MODULES],
  template: `
    <div nz-row class="center-div">
      <div nz-col nzSpan="10">
        <h1>註冊</h1>
        <form nz-form [formGroup]="validateForm" (ngSubmit)="submitForm()">
          <nz-form-item>
            <nz-form-label [nzLg]="6" [nzMd]="24" nzRequired nzFor="username"
              >使用者名稱</nz-form-label
            >
            <nz-form-control
              [nzLg]="12"
              [nzMd]="24"
              nzErrorTip="請輸入使用者名稱!"
            >
              <input nz-input formControlName="username" id="username" />
            </nz-form-control>
          </nz-form-item>
          <nz-form-item>
            <nz-form-label [nzLg]="6" [nzMd]="24" nzRequired nzFor="email"
              >Email</nz-form-label
            >
            <nz-form-control [nzLg]="12" [nzMd]="24" [nzErrorTip]="errorTpl">
              <input nz-input formControlName="email" id="email" />
              <ng-template #errorTpl let-control>
                <ng-container *ngIf="control.hasError('required')"
                  >請輸入Email！</ng-container
                >
                <ng-container *ngIf="control.hasError('email')">
                  Email格式不正確！
                </ng-container>
              </ng-template>
            </nz-form-control>
          </nz-form-item>
          <nz-form-item>
            <nz-form-label [nzLg]="6" [nzMd]="24" nzRequired nzFor="phone"
              >電話</nz-form-label
            >
            <nz-form-control [nzLg]="12" [nzMd]="24" nzErrorTip="請輸入電話!">
              <input nz-input formControlName="phone" id="phone" />
            </nz-form-control>
          </nz-form-item>
          <nz-form-item>
            <nz-form-label [nzLg]="6" [nzMd]="24" nzFor="password" nzRequired
              >密碼</nz-form-label
            >
            <nz-form-control [nzLg]="12" [nzMd]="24" nzErrorTip="請輸入密碼!">
              <input
                nz-input
                type="password"
                id="password"
                formControlName="password"
                (ngModelChange)="updateConfirmValidator()"
              />
            </nz-form-control>
          </nz-form-item>
          <nz-form-item>
            <nz-form-label
              [nzLg]="6"
              [nzMd]="24"
              nzFor="checkPassword"
              nzRequired
              >確認密碼</nz-form-label
            >
            <nz-form-control [nzLg]="12" [nzMd]="24" [nzErrorTip]="errorTpl">
              <input
                nz-input
                type="password"
                formControlName="checkPassword"
                id="checkPassword"
              />
              <ng-template #errorTpl let-control>
                <ng-container *ngIf="control.hasError('required')"
                  >請確認您的密碼！</ng-container
                >
                <ng-container *ngIf="control.hasError('confirm')">
                  兩次輸入的密碼不一致！
                </ng-container>
              </ng-template>
            </nz-form-control>
          </nz-form-item>
          <nz-form-item nz-row class="register-area">
            <nz-form-control [nzSpan]="14" [nzOffset]="4">
              <button nz-button nzType="primary">提交</button>
            </nz-form-control>
          </nz-form-item>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      nz-date-picker,
      nz-range-picker {
        margin: 0 8px 12px 0;
      }

      .center-div {
        display: flex;
        justify-content: center;
        width: 1000px;
      }
    `,
  ],
})
export class RegisterComponent implements OnInit {
  validateForm!: UntypedFormGroup;

  submitForm(): void {
    if (this.validateForm.valid) {
      const userName = this.validateForm.get('username')?.value;
      const password = this.validateForm.get('password')?.value;
      const email = this.validateForm.get('email')?.value;
      const phone = this.validateForm.get('phone')?.value;
      let registerRrequest: UsersRegisterRequest = {
        userName: userName,
        password: password,
        email: email,
        phone: phone,
      };
      this.usersService.register(registerRrequest).subscribe({
        next: (result) => {
          localStorage.setItem('token', result.data.token);
          this.loginService.loggedIn();
          if (result.data.level == 2) {
            this.loginService.loggedAdmin();
          } else {
            this.loginService.loggedOutAdmin();
          }
          this.modalService.success({
            nzTitle: '註冊成功',
            nzContent: '跳轉頁面',
            nzOnOk: () => {
              this.router.navigate(['/welcome']);
            },
          });
        },
        error: (result) => {
          this.modalService.success({
            nzTitle: result.error.returnMsg,
            nzContent: '請確認輸入資料!',
            nzOnOk: () => {},
          });
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

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() =>
      this.validateForm.controls['checkPassword'].updateValueAndValidity()
    );
  }

  confirmationValidator = (
    control: UntypedFormControl
  ): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls['password'].value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  constructor(
    private fb: UntypedFormBuilder,
    private usersService: UsersService,
    private modalService: NzModalService,
    private router: Router,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      username: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      phone: [null, [Validators.required]],
      password: [null, [Validators.required]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
    });
  }
}
