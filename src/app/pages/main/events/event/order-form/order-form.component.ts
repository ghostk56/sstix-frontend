import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SHARED_ZORRO_MODULES } from 'src/app/common/modules/shared-zorro.module';


@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule, SHARED_ZORRO_MODULES],
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.css']
})
export class OrderFormComponent {
  demoValue = 1;
  qty = 5;
  price = 1000;

  getTotal() {
    return this.demoValue * this.price;
  }

  toOrder() {
    
  }
}
