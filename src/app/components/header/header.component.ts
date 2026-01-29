import { NgClass, NgIf, NgOptimizedImage } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { IconBase } from 'src/app/utils/icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [NgClass, NgIf, NgOptimizedImage, LucideAngularModule],
})
export class HeaderComponent extends IconBase {
  @Input() title!: string;
  @Input() logo: boolean = true;
  @Input() backButton?: string | (() => void);
  @Input() profileButton: boolean = false;
  @Input() headerClass?: string;
  @Input() buttonClass?: string;

  constructor(private router: Router) {
    super();
  }

  onBackButtonClick() {
    if (typeof this.backButton === 'function') {
      this.backButton();
    } else if (typeof this.backButton === 'string') {
      this.router.navigate([this.backButton]);
    }
  }

  shouldShowBackButton(): boolean {
    return this.backButton !== undefined;
  }

  goToProfile() {
    this.router.navigate(['/main/profile']);
  }
}
