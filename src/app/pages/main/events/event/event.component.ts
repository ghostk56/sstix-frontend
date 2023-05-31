import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SHARED_ZORRO_MODULES } from 'src/app/common/modules/shared-zorro.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, SHARED_ZORRO_MODULES],
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent {
  id = '';

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!; // 通過路由快照中的 paramMap 取得 'id' 值
  }

  goToOrder() {
    this.router.navigate(['/events', this.id, 'order-form']); // 使用路由導航到 'order' 路徑
  }
}
