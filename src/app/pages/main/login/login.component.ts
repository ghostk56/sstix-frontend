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
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
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
