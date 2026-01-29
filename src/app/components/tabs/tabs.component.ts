import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { IconBase } from 'src/app/utils/icons';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonTab,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  imports: [
    NgClass,
    LucideAngularModule,
    IonContent,
    IonHeader,
    IonIcon,
    IonTab,
    IonTabBar,
    IonTabButton,
    IonTabs,
    IonTitle,
    IonToolbar,
  ],
})
export class TabsComponent extends IconBase {
  selectedTab: string = 'home';

  constructor(private router: Router) {
    super();
  }

  tabChanged(event: any) {
    this.selectedTab = event.tab;

    if (this.router.url !== `/main/${event.tab}`) {
      console.log(`Navigating to: /main/${event.tab}`);
      this.router.navigate([`/main/${event.tab}`]);
    }
  }
}
