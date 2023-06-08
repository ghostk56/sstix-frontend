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
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css'],
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
}
