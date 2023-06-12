import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { SHARED_ZORRO_MODULES } from 'src/app/common/modules/shared-zorro.module';
import { EventsResponse } from 'src/app/models/events-response';
import { EventsService } from 'src/app/services/events.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SHARED_ZORRO_MODULES,
  ],
  template: `
    <div nz-row class="center-div">
      <div nz-col nzSpan="20" *ngIf="dataLoaded">
        <h1>{{ eventData.name }}</h1>
        <h3>{{ eventData.eventDate }}</h3>
        <h3>{{ eventData.location }}</h3>
        <div class="image-container">
          <img src="http://localhost:8080/image/{{ eventData.image1 }}" />
        </div>
        <h2>{{ eventData.organizer }}</h2>
        <p>
          {{ eventData.details }}
        </p>
        <h2>票價: {{ eventData.price }}</h2>
        <ng-container *ngIf="eventData.qty > 0">
          <div *ngIf="eventData.status === 1">
            <button
              nz-button
              nzSize="large"
              nzType="primary"
              (click)="goToOrder()"
            >
              立即訂購
            </button>
          </div>
          <div *ngIf="eventData.status === 2">
            <button nz-button nzSize="large" nzType="primary" disabled>
              尚未開賣
            </button>
          </div>
        </ng-container>
        <button
          *ngIf="eventData.qty == 0"
          nzSize="large"
          nz-button
          nzType="primary"
          disabled
        >
          已售完
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .center-div {
        display: flex;
        justify-content: center;
        width: 900px;
      }

      .image-container {
        width: 600px;
        overflow: hidden; /* 隱藏溢出的內容 */
      }

      .image-container img {
        width: 100%;
        height: 100%;
        object-fit: cover; /* 填充剪裁適應容器 */
      }
    `,
  ],
})
export class EventComponent {
  eventId = '';
  eventData!: EventsResponse;
  dataLoaded = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private eventsService: EventsService,
    private modalService: NzModalService,
    private loginService: LoginService
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
    if (!this.loginService.logged$.value) {
      window.scrollTo(0, 0);
      this.modalService.success({
        nzTitle: '未登入',
        nzContent: '請先登入!',
        nzOnOk: () => {
          this.router.navigate(['/login']); // 使用路由導航到 'login' 路徑
        },
      });
    } else {
      this.router.navigate(['/events', this.eventId, 'order-form']); // 使用路由導航到 'order' 路徑
    }
  }
}
