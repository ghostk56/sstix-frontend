import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SHARED_ZORRO_MODULES } from 'src/app/common/modules/shared-zorro.module';
import { NzUploadChangeParam, NzUploadModule } from 'ng-zorro-antd/upload';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { EventAddRequest } from 'src/app/models/event-add-request';
import { EventsService } from 'src/app/services/events.service';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-edit-event',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzUploadModule,
    NzMessageModule,
    SHARED_ZORRO_MODULES,
  ],
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css'],
})
export class EditEventComponent {
  validateForm!: UntypedFormGroup;
  image = '';

  submitForm(): void {
    if (this.validateForm.valid) {
      if (this.image == '') {
        this.msg.error('請選擇圖片');
        return;
      }
      console.log('submit', this.validateForm.value);
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
