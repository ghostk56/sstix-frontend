import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { SHARED_ZORRO_MODULES } from 'src/app/common/modules/shared-zorro.module';
import { OrderUpdateRequest } from 'src/app/models/order-update-request';
import { OrdersResponse } from 'src/app/models/orders-response';
import { LoginService } from 'src/app/services/login.service';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SHARED_ZORRO_MODULES,
    NzPopconfirmModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div nz-row class="center-div">
      <div nz-col nzSpan="24">
        <h1>訂票紀錄查詢</h1>
        <nz-table #basicTable [nzData]="listOfData" [nzPageSize]="6">
          <thead>
            <tr>
              <th>活動詳情</th>
              <th>編號</th>
              <th>訂票價格</th>
              <th>訂購張數</th>
              <th>總金額</th>
              <th>訂單狀態</th>
              <th>訂購日期</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <ng-template ngFor let-data [ngForOf]="basicTable.data">
              <tr>
                <td
                  [nzExpand]="expandSet.has(data.id)"
                  (nzExpandChange)="onExpandChange(data.id, $event)"
                ></td>
                <td>{{ data.id }}</td>
                <td>{{ data.eventPrice }}</td>
                <td>{{ data.quantity }}</td>
                <td>{{ data.eventPrice * data.quantity }}</td>
                <td>
                  <container-element [ngSwitch]="data.status">
                    <some-element *ngSwitchCase="1"
                      ><nz-badge
                        [nzStatus]="'success'"
                        [nzText]="'完成'"
                      ></nz-badge
                    ></some-element>
                    <some-element *ngSwitchDefault
                      ><nz-badge
                        [nzStatus]="'error'"
                        [nzText]="'取消'"
                      ></nz-badge
                    ></some-element>
                  </container-element>
                </td>
                <td>
                  {{ data.orderDate | date : 'yyyy-MM-dd HH:mm' }}
                </td>
                <td>
                  <a
                    *ngIf="data.status == 1"
                    nz-popconfirm
                    nzPopconfirmTitle="確定取消嗎?"
                    nzPopconfirmPlacement="bottom"
                    (nzOnConfirm)="cancelOrder(data.id)"
                    nzPopconfirmPlacement="top"
                  >
                    取消</a
                  >
                  <span *ngIf="data.status == 0">已取消</span>
                </td>
              </tr>
              <tr [nzExpand]="expandSet.has(data.id)">
                <nz-table
                  #innerTable
                  [nzData]="listOfChildrenData"
                  nzSize="middle"
                  [nzShowPagination]="false"
                >
                  <thead>
                    <tr>
                      <th>活動圖片</th>
                      <th>活動名稱</th>
                      <th>主辦單位</th>
                      <th>活動地點</th>
                      <th>活動日期</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let tmp of innerTable.data">
                      <td>
                        <div class="image-container">
                          <a routerLink="/events/{{ data.event.id }}">
                            <img
                              alt="example"
                              src="http://localhost:8080/image/{{
                                data.event.image1
                              }}"
                            />
                          </a>
                        </div>
                      </td>
                      <td>{{ data.event.name }}</td>
                      <td>{{ data.event.organizer }}</td>
                      <td>{{ data.event.location }}</td>
                      <td>{{ data.event.eventDate }}</td>
                    </tr>
                  </tbody></nz-table
                >
              </tr></ng-template
            >
          </tbody>
        </nz-table>
      </div>
    </div>
  `,
  styles: [
    `
      .image-container {
        width: 200px;
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
    private modalService: NzModalService,
    private loginService: LoginService
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
              nzOnOk: () => {
                this.loggedOut();
              },
            });
          }
        },
        complete: () => {},
      });
    } else {
      this.loggedOut();
    }
  }

  loggedOut() {
    this.loginService.loggedOut();
    this.router.navigate(['/login']);
  }
}
