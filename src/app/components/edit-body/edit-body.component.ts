import { Component, Input, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import {
  IonContent,
  ModalController,
  ToastController,
} from '@ionic/angular/standalone';
import { CommonModule, DecimalPipe } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { BmiCategory, User } from 'src/app/utils/types';
import { AuthService } from 'src/app/services/auth.service';
import {
  getBMI,
  getBmiCategory,
  MAX_HEIGHT,
  MAX_WEIGHT,
  MIN_HEIGHT,
  MIN_WEIGHT,
} from 'src/app/utils/bmi';
import { IconBase } from 'src/app/utils/icons';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-body',
  templateUrl: './edit-body.component.html',
  styleUrls: ['./edit-body.component.scss'],
  standalone: true,
  imports: [
    HeaderComponent,
    IonContent,
    CommonModule,
    FormsModule,
    LucideAngularModule,
  ],
})
export class EditBodyComponent extends IconBase implements OnInit {
  @Input() user!: User;

  height: number = 170;
  weight: number = 70;
  bmi: number = 0;
  bmiCategory: BmiCategory = 'Peso normal';

  constructor(
    private modalCtrl: ModalController,
    private authService: AuthService,
    private toastCtrl: ToastController
  ) {
    super();
  }

  ngOnInit(): void {
    this.height = this.user.height || 170;
    this.weight = this.user.weight || 70;
    this.calculateBMI();
  }

  changeHeight(step: number): void {
    const newHeight = this.height + step;
    if (newHeight >= MIN_HEIGHT && newHeight <= MAX_HEIGHT) {
      this.height = newHeight;
      this.calculateBMI();
    }
  }

  changeWeight(step: number): void {
    const newWeight = this.weight + step;
    if (newWeight >= MIN_WEIGHT && newWeight <= MAX_WEIGHT) {
      this.weight = newWeight;
      this.calculateBMI();
    }
  }

  calculateBMI(): void {
    this.bmi = getBMI(this.height, this.weight);
    this.bmiCategory = getBmiCategory(this.bmi);
  }

  async saveChanges() {
    try {
      await this.authService.updateBMI({
        height: this.height,
        weight: this.weight,
        bmi: this.bmi,
      });

      const toast = await this.toastCtrl.create({
        message: 'Datos de salud actualizados',
        duration: 1500,
        position: 'top',
        icon: 'checkmark-circle-outline',
        cssClass: 'custom-toast',
      });
      toast.present();

      this.modalCtrl.dismiss({
        updated: true,
        height: this.height,
        weight: this.weight,
        bmi: this.bmi,
      });
    } catch (err) {
      console.error('Error al guardar datos:', err);
    }
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
