import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { SHARED_ZORRO_MODULES } from 'src/app/common/modules/shared-zorro.module';
import { OrdersResponse } from 'src/app/models/orders-response';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SHARED_ZORRO_MODULES,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div nz-row class="center-div">
      <div nz-col nzSpan="24">
        <h1>訂購紀錄查詢</h1>
        <nz-table #basicTable [nzData]="listOfData" [nzPageSize]="6">
          <thead>
            <tr>
              <th>活動詳情</th>
              <th>編號</th>
              <th>訂購人編號</th>
              <th>訂票價格</th>
              <th>訂購數量</th>
              <th>訂單狀態</th>
              <th>訂購日期</th>
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
                <td>{{ data.userId }}</td>
                <td>{{ data.eventPrice }}</td>
                <td>{{ data.quantity }}</td>
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
                      <th>活動編號</th>
                      <th>活動名稱</th>
                      <th>主辦單位</th>
                      <th>活動地點</th>
                      <th>活動日期</th>
                      <th>狀態</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let tmp of innerTable.data">
                      <td>{{ data.event.id }}</td>
                      <td>{{ data.event.name }}</td>
                      <td>{{ data.event.organizer }}</td>
                      <td>{{ data.event.location }}</td>
                      <td>{{ data.event.eventDate }}</td>
                      <td>
                        <container-element [ngSwitch]="data.event.status">
                          <some-element *ngSwitchCase="1"
                            ><nz-badge
                              [nzStatus]="'success'"
                              [nzText]="'販售中'"
                            ></nz-badge
                          ></some-element>
                          <some-element *ngSwitchCase="2"
                            ><nz-badge
                              [nzStatus]="'processing'"
                              [nzText]="'未開賣'"
                            ></nz-badge
                          ></some-element>
                          <some-element *ngSwitchDefault
                            ><nz-badge
                              [nzStatus]="'error'"
                              [nzText]="'下架'"
                            ></nz-badge
                          ></some-element>
                        </container-element>
                      </td>
                    </tr></tbody
                ></nz-table></tr
            ></ng-template>
          </tbody>
        </nz-table>
      </div>
    </div>
  `,
  styles: [``],
})
export class AdminOrdersComponent implements OnInit {
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

  constructor(
    private router: Router,
    private ordersService: OrdersService,
    private modalService: NzModalService
  ) {}

  ngOnInit(): void {
    let token = localStorage.getItem('token');
    if (token) {
      this.ordersService.selectAllOrders(token).subscribe({
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
