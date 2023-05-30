import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SHARED_ZORRO_MODULES } from 'src/app/common/modules/shared-zorro.module';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, SHARED_ZORRO_MODULES],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent {
  array = [1, 2, 3, 4, 5, 6, 7, 8];
}
