import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzModalService } from 'ng-zorro-antd/modal';
import { SHARED_ZORRO_MODULES } from 'src/app/common/modules/shared-zorro.module';
import { EventsResponse } from 'src/app/models/events-response';
import { EventsService } from 'src/app/services/events.service';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SHARED_ZORRO_MODULES,
    NzEmptyModule,
  ],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
})
export class EventsComponent {
  eventsData: EventsResponse[] = [];

  constructor(
    private eventsService: EventsService,
    private modalService: NzModalService
  ) {}

  ngOnInit(): void {
    this.selectEvents();
  }

  selectEvents(name: string = '') {
    this.eventsService.selectAllEvents(name, 1).subscribe({
      next: (result) => {
        if (result.returnCode == '00000' && result.data != null) {
          this.eventsData = result.data;
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

  onEnterPressed(value: string) {
    this.selectEvents(value);
  }
}
