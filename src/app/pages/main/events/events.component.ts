import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SHARED_ZORRO_MODULES } from 'src/app/common/modules/shared-zorro.module';
import { EventsResponse } from 'src/app/models/events-response';
import { NzModalService } from 'ng-zorro-antd/modal';
import { EventsService } from 'src/app/services/events.service';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SHARED_ZORRO_MODULES,
  ],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
})
export class EventsComponent {
  eventsData: EventsResponse[] = [];

  constructor(
    private router: Router,
    private eventsService: EventsService,
    private modalService: NzModalService
  ) {}

  ngOnInit(): void {
    this.eventsService.selectAllEvents('', 1).subscribe({
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
}
