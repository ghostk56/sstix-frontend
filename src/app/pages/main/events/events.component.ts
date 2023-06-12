import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzModalService } from 'ng-zorro-antd/modal';
import { SHARED_ZORRO_MODULES } from 'src/app/common/modules/shared-zorro.module';
import { EventsResponse } from 'src/app/models/events-response';
import { EventsService } from 'src/app/services/events.service';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SHARED_ZORRO_MODULES,
    NzEmptyModule,
  ],
  template: `
    <div class="container">
      <nz-input-group [nzSuffix]="suffixIconSearch">
        <input
          type="text"
          nz-input
          placeholder="搜索活動"
          (keydown.enter)="onEnterPressed(searchInput.value)"
          #searchInput
        />
      </nz-input-group>
      <ng-template #suffixIconSearch>
        <span nz-icon nzType="search"></span>
      </ng-template>
      <br />
      <br />
      <h1>活動</h1>
      <ng-container *ngIf="eventsData.length === 0">
        <nz-empty nzNotFoundContent="找不到相關內容!"></nz-empty>
      </ng-container>
      <div nz-row [nzGutter]="[20, 20]">
        <div
          nz-col
          class="gutter-row"
          [nzSpan]="8"
          *ngFor="let data of eventsData"
        >
          <nz-card nzHoverable style="width: 320px" [nzCover]="coverTemplate">
            <nz-card-meta
              nzTitle="{{ data.name }}"
              nzDescription="{{ data.eventDate }}"
            ></nz-card-meta>
            <br />
            <p *ngIf="data.qty > 0">
              {{ data.status === 1 ? '販售中' : '尚未開賣' }}
            </p>
            <p *ngIf="data.qty == 0">已售完</p>
          </nz-card>
          <ng-template #coverTemplate>
            <div class="image-container">
              <a routerLink="/events/{{ data.id }}">
                <img
                  alt="example"
                  src="http://localhost:8080/image/{{ data.image1 }}"
                />
              </a>
            </div>
          </ng-template>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .container {
        width: 1000px;
      }

      .image-container {
        height: 200px;
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
export class EventsComponent {
  eventsData: EventsResponse[] = [];

  constructor(
    private eventsService: EventsService,
    private modalService: NzModalService
  ) {}

  ngOnInit(): void {
    this.selectEvents();
  }

  selectEvents(name: string = '') {
    this.eventsService.selectAllEvents(name, 1).subscribe({
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

  onEnterPressed(value: string) {
    this.selectEvents(value);
  }
}
