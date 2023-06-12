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
import { SHARED_ZORRO_MODULES } from 'src/app/common/modules/shared-zorro.module';
import { UsersUpdateRequest } from 'src/app/models/users-update-request';
import { LoginService } from 'src/app/services/login.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-edit-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SHARED_ZORRO_MODULES],
  template: `
    <div nz-row class="center-div">
      <div nz-col nzSpan="10">
        <h1>修改密碼</h1>
        <form nz-form [formGroup]="validateForm" (ngSubmit)="submitForm()">
          <nz-form-item>
            <nz-form-label [nzLg]="6" [nzMd]="24" nzRequired nzFor="oldPassword"
              >原密碼</nz-form-label
            >
            <nz-form-control [nzLg]="12" [nzMd]="24" nzErrorTip="請輸入原密碼!">
              <input
                nz-input
                type="password"
                formControlName="oldPassword"
                id="oldPassword"
              />
            </nz-form-control>
          </nz-form-item>
          <nz-form-item>
            <nz-form-label [nzLg]="6" [nzMd]="24" nzFor="password" nzRequired
              >新密碼</nz-form-label
            >
            <nz-form-control [nzLg]="12" [nzMd]="24" nzErrorTip="請輸入新密碼!">
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
              >確認新密碼</nz-form-label
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
                  >請確認新密碼！</ng-container
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
export class EditInfoComponent implements OnInit {
  validateForm!: UntypedFormGroup;

  submitForm(): void {
    if (this.validateForm.valid) {
      let user: UsersUpdateRequest = {
        oldPassword: this.validateForm.get('oldPassword')?.value,
        password: this.validateForm.get('password')?.value,
      };
      let token = localStorage.getItem('token');
      if (token) {
        this.usersService.eidtInfo(token, user).subscribe({
          next: (result) => {
            if (result.returnCode == '00000') {
              this.modalService.success({
                nzTitle: result.returnMsg,
                nzContent: '修改成功!',
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
                nzContent: '修改失敗!',
                nzOnOk: () => {},
              });
            }
          },
          complete: () => {},
        });
      } else {
        this.loggedOut();
      }
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

  loggedOut() {
    this.loginService.loggedOut();
    this.router.navigate(['/login']);
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
      oldPassword: [null, [Validators.required]],
      password: [null, [Validators.required]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
    });
  }
}
