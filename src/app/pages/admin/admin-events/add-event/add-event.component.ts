import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzUploadChangeParam, NzUploadModule } from 'ng-zorro-antd/upload';
import { SHARED_ZORRO_MODULES } from 'src/app/common/modules/shared-zorro.module';
import { EventAddRequest } from 'src/app/models/event-add-request';
import { EventsService } from 'src/app/services/events.service';

@Component({
  selector: 'app-add-event',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzUploadModule,
    NzMessageModule,
    SHARED_ZORRO_MODULES,
  ],
  template: `
    <div nz-row class="center-div">
      <div nz-col nzSpan="14">
        <h1>新增活動</h1>
        <nz-upload
          nzName="image"
          nzAction="http://localhost:8080/image"
          [nzFileType]="'image/png,image/jpeg,image/gif'"
          (nzChange)="handleChange($event)"
        >
          <button nz-button>
            <span nz-icon nzType="upload"></span>
            上傳圖片
          </button>
        </nz-upload>
        <form
          nz-form
          nzLayout="vertical"
          [formGroup]="validateForm"
          (ngSubmit)="submitForm()"
        >
          <nz-form-item>
            <nz-form-label [nzLg]="6" [nzMd]="24" nzRequired nzFor="name"
              >活動名稱</nz-form-label
            >
            <nz-form-control
              [nzLg]="12"
              [nzMd]="24"
              nzErrorTip="請輸入活動名稱!"
            >
              <input nz-input formControlName="name" id="name" />
            </nz-form-control>
          </nz-form-item>
          <nz-form-item>
            <nz-form-label [nzLg]="6" [nzMd]="24" nzRequired nzFor="organizer"
              >主辦單位</nz-form-label
            >
            <nz-form-control
              [nzLg]="12"
              [nzMd]="24"
              nzErrorTip="請輸入主辦單位!"
            >
              <input nz-input formControlName="organizer" id="organizer" />
            </nz-form-control>
          </nz-form-item>
          <nz-form-item>
            <nz-form-label [nzLg]="6" [nzMd]="24" nzRequired nzFor="location"
              >活動地點</nz-form-label
            >
            <nz-form-control
              [nzLg]="12"
              [nzMd]="24"
              nzErrorTip="請輸入活動地點!"
            >
              <input nz-input formControlName="location" id="location" />
            </nz-form-control>
          </nz-form-item>
          <nz-form-item>
            <nz-form-label [nzLg]="6" [nzMd]="24" nzRequired nzFor="eventDate"
              >活動日期</nz-form-label
            >
            <nz-form-control
              [nzLg]="12"
              [nzMd]="24"
              nzErrorTip="請輸入活動日期!"
            >
              <input nz-input formControlName="eventDate" id="eventDate" />
            </nz-form-control>
          </nz-form-item>
          <nz-form-item>
            <nz-form-label [nzLg]="6" [nzMd]="24" nzRequired nzFor="details"
              >活動詳情</nz-form-label
            >
            <nz-form-control
              [nzLg]="12"
              [nzMd]="24"
              nzErrorTip="請輸入活動詳情!"
            >
              <textarea
                rows="4"
                nz-input
                formControlName="details"
                id="details"
              ></textarea>
            </nz-form-control>
          </nz-form-item>
          <nz-form-item>
            <nz-form-label [nzLg]="6" [nzMd]="24" nzRequired nzFor="price"
              >價格</nz-form-label
            >
            <nz-form-control [nzLg]="12" [nzMd]="24" nzErrorTip="請輸入價格!">
              <nz-input-number
                [nzMin]="100"
                [nzMax]="10000"
                [nzStep]="100"
                formControlName="price"
                id="price"
              ></nz-input-number>
            </nz-form-control>
          </nz-form-item>
          <nz-form-item>
            <nz-form-label [nzLg]="6" [nzMd]="24" nzRequired nzFor="qty"
              >庫存</nz-form-label
            >
            <nz-form-control [nzLg]="12" [nzMd]="24" nzErrorTip="請輸入庫存!">
              <nz-input-number
                [nzMin]="10"
                [nzMax]="10000"
                [nzStep]="1"
                formControlName="qty"
                id="qty"
              ></nz-input-number>
            </nz-form-control>
          </nz-form-item>
          <nz-form-item>
            <nz-form-label [nzLg]="6" [nzMd]="24" nzRequired nzFor="status"
              >狀態</nz-form-label
            >
            <nz-form-control [nzLg]="12" [nzMd]="24" nzErrorTip="請輸入狀態!">
              <nz-radio-group
                [ngModel]="'0'"
                formControlName="status"
                id="status"
              >
                <label nz-radio nzValue="1">販售中</label>
                <label nz-radio nzValue="2">未開賣</label>
                <label nz-radio nzValue="0">下架</label>
              </nz-radio-group>
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
      }
    `,
  ],
})
export class AddEventComponent {
  validateForm!: UntypedFormGroup;
  image = '';

  submitForm(): void {
    if (this.validateForm.valid) {
      if (this.image == '') {
        this.msg.error('請選擇圖片');
        return;
      }
      let req: EventAddRequest = {
        name: this.validateForm.get('name')?.value,
        details: this.validateForm.get('details')?.value,
        location: this.validateForm.get('location')?.value,
        organizer: this.validateForm.get('organizer')?.value,
        eventDate: this.validateForm.get('eventDate')?.value,
        status: this.validateForm.get('status')?.value,
        price: this.validateForm.get('price')?.value,
        qty: this.validateForm.get('qty')?.value,
        image1: this.image,
      };
      let token = localStorage.getItem('token');
      if (token) {
        this.eventsService.addEvent(token, req).subscribe({
          next: (result) => {
            if (result.returnCode == '00000') {
              this.modalService.success({
                nzTitle: result.returnCode,
                nzContent: result.returnMsg,
                nzOnOk: () => {
                  this.router.navigate(['admin/admin-events']);
                },
              });
            }
          },
          error: (result) => {
            if (result.status == 403) {
              this.modalService.success({
                nzTitle: result.error.returnMsg,
                nzContent: '錯誤!',
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

  handleChange(info: NzUploadChangeParam): void {
    if (info.file.status === 'done') {
      this.image = info.file.response.data;
      this.msg.success(`${info.file.name} 圖片上傳成功`);
    } else if (info.file.status === 'error') {
      this.msg.error(`${info.file.name} file upload failed.`);
    }
  }

  constructor(
    private fb: UntypedFormBuilder,
    private msg: NzMessageService,
    private eventsService: EventsService,
    private modalService: NzModalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      details: [null, [Validators.required]],
      organizer: [null, [Validators.required]],
      location: [null, [Validators.required]],
      eventDate: [null, [Validators.required]],
      price: [null, [Validators.required]],
      qty: [null, [Validators.required]],
      status: [null, [Validators.required]],
    });
  }
}
