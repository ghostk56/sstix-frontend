import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SHARED_ZORRO_MODULES } from '../../common/modules/shared-zorro.module';
import { RouterModule } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  standalone: true,
  selector: 'app-admin',
  imports: [CommonModule, RouterModule, SHARED_ZORRO_MODULES],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent {
  constructor(public loginService: LoginService) {}
}
