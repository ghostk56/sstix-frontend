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
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
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
