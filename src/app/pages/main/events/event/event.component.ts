import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { SHARED_ZORRO_MODULES } from 'src/app/common/modules/shared-zorro.module';
import { EventsResponse } from 'src/app/models/events-response';
import { EventsService } from 'src/app/services/events.service';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SHARED_ZORRO_MODULES,
  ],
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css'],
})
export class EventComponent {
  eventId = '';
  eventData!: EventsResponse;
  dataLoaded = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private eventsService: EventsService,
    private modalService: NzModalService
  ) {}

  ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('id')!; // 通過路由快照中的 paramMap 取得 'id' 值
    this.eventsService.selectIdEvent(this.eventId).subscribe({
      next: (result) => {
        if (result.returnCode == '00000' && result.data != null) {
          this.eventData = result.data;
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

  goToOrder() {
    this.router.navigate(['/events', this.eventId, 'order-form']); // 使用路由導航到 'order' 路徑
  }
}
