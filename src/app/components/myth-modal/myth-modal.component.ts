import { Component, Input, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { IonContent, ModalController } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { HealthMyth } from 'src/app/data/health-myths.data';
import { LucideAngularModule } from 'lucide-angular';
import { IconBase } from 'src/app/utils/icons';

@Component({
  selector: 'app-myth-modal',
  templateUrl: './myth-modal.component.html',
  styleUrls: ['./myth-modal.component.scss'],
  standalone: true,
  imports: [HeaderComponent, IonContent, CommonModule, LucideAngularModule],
})
export class MythModalComponent extends IconBase implements OnInit {
  @Input() myth!: HealthMyth;

  constructor(private modalCtrl: ModalController) {
    super();
  }

  ngOnInit() {}

  closeModal() {
    this.modalCtrl.dismiss({
      dismissed: true,
    });
  }
}
