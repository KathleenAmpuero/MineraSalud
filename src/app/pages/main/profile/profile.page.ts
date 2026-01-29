import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  IonContent,
  ModalController,
  ToastController,
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { IconBase } from 'src/app/utils/icons';
import { LucideAngularModule } from 'lucide-angular';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { EditProfileComponent } from 'src/app/components/edit-profile/edit-profile.component';
import { BmiCategory, User } from 'src/app/utils/types';
import { ChangePasswordComponent } from 'src/app/components/change-password/change-password.component';
import { formatBmi, getBmiCategory } from 'src/app/utils/bmi';
import { EditBodyComponent } from 'src/app/components/edit-body/edit-body.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    LucideAngularModule,
    ReactiveFormsModule,
    HeaderComponent,
  ],
})
export class ProfilePage extends IconBase implements OnInit, OnDestroy {
  currentUser: User | null = null;
  bmiCategory: BmiCategory = 'Peso normal';
  formattedBmi: string = '';
  private userSub: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) {
    super();
  }

  ngOnInit() {
    this.userSub = this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;

      if (!user) {
        this.router.navigate(['/auth/login']);
      } else {
        this.setBmiCategory();
      }
    });
  }

  ngOnDestroy() {
    this.userSub?.unsubscribe();
  }

  private setBmiCategory(): void {
    this.bmiCategory = getBmiCategory(this.currentUser?.bmi || 0);
    this.formattedBmi = this.currentUser?.bmi
      ? formatBmi(this.currentUser.bmi)
      : '0.0';
  }

  async changePasswordToast() {
    const toast = await this.toastCtrl.create({
      message: 'Contraseña cambiada exitosamente',
      cssClass: 'custom-toast',
      duration: 1500,
      position: 'top',
    });

    await toast.present();
  }

  async editProfileModal() {
    const modal = await this.modalCtrl.create({
      component: EditProfileComponent,
      componentProps: {
        user: this.currentUser,
      },
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data?.updated) {
      this.currentUser = data.updated;
    }
  }

  async changePasswordModal() {
    const modal = await this.modalCtrl.create({
      component: ChangePasswordComponent,
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data?.changed) {
      this.changePasswordToast();
    }
  }

  async editBodyModal() {
    const modal = await this.modalCtrl.create({
      component: EditBodyComponent,
      componentProps: {
        user: this.currentUser,
      },
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data?.updated) {
      this.currentUser!.height = data.height;
      this.currentUser!.weight = data.weight;
      this.currentUser!.bmi = data.bmi;
      this.setBmiCategory();
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
