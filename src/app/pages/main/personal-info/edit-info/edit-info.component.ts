import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SHARED_ZORRO_MODULES } from 'src/app/common/modules/shared-zorro.module';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UsersService } from 'src/app/services/users.service';
import { UsersUpdateRequest } from 'src/app/models/users-update-request';

@Component({
  selector: 'app-edit-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SHARED_ZORRO_MODULES],
  templateUrl: './edit-info.component.html',
  styleUrls: ['./edit-info.component.css'],
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

  constructor(
    private fb: UntypedFormBuilder,
    private usersService: UsersService,
    private modalService: NzModalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      oldPassword: [null, [Validators.required]],
      password: [null, [Validators.required]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
    });
  }
}
