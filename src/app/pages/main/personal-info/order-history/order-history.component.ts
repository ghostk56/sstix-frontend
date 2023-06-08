import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { SHARED_ZORRO_MODULES } from 'src/app/common/modules/shared-zorro.module';
import { OrderUpdateRequest } from 'src/app/models/order-update-request';
import { OrdersResponse } from 'src/app/models/orders-response';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SHARED_ZORRO_MODULES,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css'],
})
export class OrderHistoryComponent implements OnInit {
  listOfData: OrdersResponse[] = [];
  listOfChildrenData: number[] = [0];

  expandSet = new Set<number>();
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  cancelOrder(id: number) {
    let token = localStorage.getItem('token');
    if (token) {
      let req: OrderUpdateRequest = {
        orderId: id,
        status: 0,
      };
      this.ordersService.cancelOrder(token, req).subscribe({
        next: (result) => {
          if (result.returnCode == '00000') {
            this.modalService.success({
              nzTitle: result.returnMsg,
              nzContent: '已取消',
              nzOnOk: () => {},
            });
            this.selectOrders();
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

  constructor(
    private router: Router,
    private ordersService: OrdersService,
    private modalService: NzModalService
  ) {}

  ngOnInit(): void {
    this.selectOrders();
  }

  selectOrders() {
    let token = localStorage.getItem('token');
    if (token) {
      this.ordersService.selectUserOrders(token).subscribe({
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
}
