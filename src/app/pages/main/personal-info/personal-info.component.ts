import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SHARED_ZORRO_MODULES } from 'src/app/common/modules/shared-zorro.module';

@Component({
  selector: 'app-personal-info',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, SHARED_ZORRO_MODULES],
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.css']
})
export class PersonalInfoComponent {
  data = {
    username: 'apple1234',
    email: 'apple@email.com'
    };
}
