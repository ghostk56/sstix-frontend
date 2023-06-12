import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { SHARED_ZORRO_MODULES } from 'src/app/common/modules/shared-zorro.module';
import { EventsResponse } from 'src/app/models/events-response';
import { EventsService } from 'src/app/services/events.service';

@Component({
  selector: 'app-admin-events',
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
        <h1>活動查詢</h1>
        <button nz-button nzType="primary" (click)="goToAddEvent()">
          新增活動
        </button>
        <nz-table #basicTable [nzData]="listOfData" [nzPageSize]="6">
          <thead>
            <tr>
              <th>圖片</th>
              <th>編號</th>
              <th>活動名稱</th>
              <th>活動詳情</th>
              <th>活動日期</th>
              <th>狀態</th>
              <th>價格</th>
              <th>庫存</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <ng-container *ngFor="let data of basicTable.data">
              <tr>
                <td>
                  <div class="image-container">
                    <img src="http://localhost:8080/image/{{ data.image1 }}" />
                  </div>
                </td>
                <td>{{ data.id }}</td>
                <td>{{ data.name }}</td>
                <td
                  [nzExpand]="expandSet.has(data.id)"
                  (nzExpandChange)="onExpandChange(data.id, $event)"
                ></td>
                <td>{{ data.eventDate }}</td>
                <td>
                  <container-element [ngSwitch]="data.status">
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
                <td>{{ data.price }}</td>
                <td>{{ data.qty }}</td>
                <td>
                  <a routerLink="/admin/edit-event/{{ data.id }}">修改</a>
                </td>
              </tr>
              <tr [nzExpand]="expandSet.has(data.id)">
                <p>{{ data.details }}</p>
                <p>{{ data.location }}</p>
                <p>{{ data.organizer }}</p>
              </tr>
            </ng-container>
          </tbody>
        </nz-table>
      </div>
    </div>
  `,
  styles: [
    `
      .image-container {
        height: 50px;
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
export class AdminEventsComponent implements OnInit {
  listOfData: EventsResponse[] = [];

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
    private eventsService: EventsService,
    private modalService: NzModalService
  ) {}

  ngOnInit(): void {
    this.eventsService.selectAllEvents().subscribe({
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

  goToAddEvent() {
    this.router.navigate(['/admin/add-event']);
  }
}
