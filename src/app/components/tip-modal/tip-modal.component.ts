import { Component, Input, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { IonContent, ModalController } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { HealthyTip } from 'src/app/data/healthy-tips.data';

@Component({
  selector: 'app-tip-modal',
  templateUrl: './tip-modal.component.html',
  styleUrls: ['./tip-modal.component.scss'],
  standalone: true,
  imports: [HeaderComponent, IonContent, CommonModule],
})
export class TipModalComponent implements OnInit {
  @Input() title!: string;
  @Input() tip!: HealthyTip;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  closeModal() {
    this.modalCtrl.dismiss({
      dismissed: true,
    });
  }
}
