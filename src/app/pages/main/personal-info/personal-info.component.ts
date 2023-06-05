import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SHARED_ZORRO_MODULES } from 'src/app/common/modules/shared-zorro.module';
import { UsersInfoResponse } from '../../../models/users-info-response';
import { UsersService } from 'src/app/services/users.service';
import { NzModalService } from 'ng-zorro-antd/modal';

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

  constructor(
    private usersService: UsersService,
    private modalService: NzModalService,
    private router: Router
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
                this.router.navigate(['/login']);
              },
            });
          }
        },
        complete: () => {},
      });
    }
  }
}
