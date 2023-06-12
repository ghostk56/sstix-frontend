import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzModalService } from 'ng-zorro-antd/modal';
import { SHARED_ZORRO_MODULES } from 'src/app/common/modules/shared-zorro.module';
import { EventsResponse } from 'src/app/models/events-response';
import { EventsService } from 'src/app/services/events.service';

@Component({
  standalone: true,
  imports: [
    NzCarouselModule,
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    SHARED_ZORRO_MODULES,
  ],
  selector: 'app-welcome',
  template: `
    <div class="carousel-content" *ngIf="eventsData.length > 0">
      <nz-carousel nzEffect="scrollx" nzAutoPlay>
        <div nz-carousel-content>
          <img
            alt="example"
            src="http://localhost:8080/image/{{ eventsData[0].image1 }}"
          />
        </div>
        <div nz-carousel-content>
          <img
            alt="example"
            src="http://localhost:8080/image/{{ eventsData[1].image1 }}"
          />
        </div>
        <div nz-carousel-content>
          <img
            alt="example"
            src="http://localhost:8080/image/{{ eventsData[2].image1 }}"
          />
        </div>
      </nz-carousel>
    </div>

    <br />

    <h1>精選活動</h1>
    <div nz-row [nzGutter]="[20, 20]">
      <div
        nz-col
        class="gutter-row"
        [nzSpan]="8"
        *ngFor="let data of eventsData; let idx = index"
        [hidden]="idx >= 3"
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
  `,
  styles: [
    `
      .carousel-content {
        height: 400px;
      }

      [nz-carousel-content] {
        text-align: center;
        height: 400px;
        line-height: 160px;
        background: #364d79;
        color: #fff;
        overflow: hidden;
      }

      [nz-carousel-content] img {
        width: 100%;
        height: 100%;
        object-fit: cover; /* 填充剪裁適應容器 */
      }

      h3 {
        color: #fff;
        margin-bottom: 0;
        user-select: none;
      }

      h1 {
        text-align: center;
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
export class WelcomeComponent {
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
}
