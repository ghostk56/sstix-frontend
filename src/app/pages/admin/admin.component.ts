import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SHARED_ZORRO_MODULES } from '../../common/modules/shared-zorro.module';
import { RouterModule } from '@angular/router';


@Component({
  standalone: true,
  selector: 'app-admin',
  imports: [CommonModule, RouterModule, SHARED_ZORRO_MODULES],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  isCollapsed = false;
}
