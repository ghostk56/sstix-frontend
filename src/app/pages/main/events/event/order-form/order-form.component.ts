import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { SHARED_ZORRO_MODULES } from 'src/app/common/modules/shared-zorro.module';
import { EventsResponse } from 'src/app/models/events-response';
import { OrderAddRequest } from 'src/app/models/order-add-request';
import { EventsService } from 'src/app/services/events.service';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SHARED_ZORRO_MODULES,
    FormsModule,
  ],
  template: `
    <div nz-row class="center-div" *ngIf="dataLoaded">
      <div nz-col nzSpan="16">
        <h1>訂票</h1>
        <h2>{{ eventData.name }}</h2>
        <h3>{{ eventData.eventDate }}</h3>
        <div class="image-container">
          <img src="http://localhost:8080/image/{{ eventData.image1 }}" />
        </div>
        <h3>票價: {{ '$' + eventData.price }}</h3>
        <ng-container *ngIf="eventData.qty > 0">
          <label>張數:</label
          ><nz-input-number
            [(ngModel)]="demoValue"
            [nzMin]="1"
            [nzMax]="eventData.qty"
            [nzStep]="1"
          ></nz-input-number>
          <h2>總金額: {{ '$' + demoValue * eventData.price }}</h2>
          <button
            nz-button
            nzSize="large"
            nzType="primary"
            (click)="showConfirm()"
          >
            確認送出
          </button>
        </ng-container>
        <ng-container *ngIf="eventData.qty == 0">
          <h2>已售完</h2>
        </ng-container>
      </div>
    </div>
  `,
  styles: [
    `
      .center-div {
        display: flex;
        justify-content: center;
        width: 800px;
      }

      .image-container {
        width: 500px;
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
export class OrderFormComponent {
  eventId = '';
  eventData!: EventsResponse;
  dataLoaded = false;
  demoValue = 1;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private eventsService: EventsService,
    private modalService: NzModalService,
    private ordersService: OrdersService
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

  toOrder() {
    let token = localStorage.getItem('token');
    if (token) {
      let req: OrderAddRequest = {
        eventsId: this.eventId,
        quantity: this.demoValue,
      };
      this.ordersService.addOrders(token, req).subscribe({
        next: (result) => {
          if (result.returnCode == '00000') {
            this.modalService.success({
              nzTitle: result.returnMsg,
              nzContent: '訂購成功',
              nzOnOk: () => {
                this.router.navigate(['/personal-info']);
              },
            });
          } else {
            this.modalService.success({
              nzTitle: result.returnCode,
              nzContent: result.returnMsg,
              nzOnOk: () => {
                this.router.navigate(['/events']);
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
  }

  showConfirm() {
    this.modalService.confirm({
      nzTitle: '確定送出訂單?',
      nzContent: '總金額: ' + this.demoValue * this.eventData.price,
      nzOnOk: () => {
        this.toOrder();
      },
    });
  }
}
