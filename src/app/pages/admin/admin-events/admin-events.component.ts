import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SHARED_ZORRO_MODULES } from 'src/app/common/modules/shared-zorro.module';
import { EventsResponse } from 'src/app/models/events-response';
import { NzModalService } from 'ng-zorro-antd/modal';
import { EventsService } from 'src/app/services/events.service';
import { Token } from '@angular/compiler';

@Component({
  selector: 'app-admin-events',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SHARED_ZORRO_MODULES,
  ],
  templateUrl: './admin-events.component.html',
  styleUrls: ['./admin-events.component.css'],
})
export class AdminEventsComponent implements OnInit {
  listOfData: EventsResponse[] = [];

  constructor(
    private router: Router,
    private eventsService: EventsService,
    private modalService: NzModalService
  ) {}

  ngOnInit(): void {
    let token = localStorage.getItem('token');
    if (token) {
      this.eventsService.selectAllEvents(token).subscribe({
        next: (result) => {
          if (result.returnCode == '00000' && result.data != null) {
            this.listOfData = result.data;
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

  goToAddEvent() {
    this.router.navigate(['/admin/add-event']);
  }
}
