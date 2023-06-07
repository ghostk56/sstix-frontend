import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzUploadChangeParam, NzUploadModule } from 'ng-zorro-antd/upload';
import { SHARED_ZORRO_MODULES } from 'src/app/common/modules/shared-zorro.module';
import { EventUpdateRequest } from 'src/app/models/event-update-request';
import { EventsResponse } from 'src/app/models/events-response';
import { EventsService } from 'src/app/services/events.service';

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
  data!: EventsResponse;
  dataLoaded = false;
  eventId!: string;

  submitForm(): void {
    if (this.validateForm.valid) {
      let req: EventUpdateRequest = {
        id: this.eventId,
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
        this.eventsService.editEvent(token, req).subscribe({
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
    private router: Router,
    private route: ActivatedRoute
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

    this.eventId = this.route.snapshot.paramMap.get('id')!;
    if (this.eventId) {
      this.eventsService.selectIdEvent(this.eventId).subscribe({
        next: (result) => {
          if (result.returnCode == '00000' && result.data != null) {
            this.data = result.data;
            this.dataLoaded = true;
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
  }
}
