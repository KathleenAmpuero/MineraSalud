import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonContent, ModalController } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { IconBase } from 'src/app/utils/icons';
import { passwordPattern } from 'src/app/utils/validations';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  standalone: true,
  imports: [
    HeaderComponent,
    IonContent,
    CommonModule,
    LucideAngularModule,
    ReactiveFormsModule,
  ],
})
export class ChangePasswordComponent extends IconBase implements OnInit {
  form!: FormGroup;
  isSubmitting = false;
  submitMessage = '';
  submitSuccess = false;
  showCurrentPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private modalCtrl: ModalController,
    private authService: AuthService,
    private fb: NonNullableFormBuilder
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(passwordPattern),
        ],
      ],
      confirmPassword: ['', [Validators.required]],
    });
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  hasError(controlName: string, error: string): boolean {
    const control = this.form.get(controlName);
    return (control?.touched && control.hasError(error)) ?? false;
  }

  passwordMismatch(): boolean {
    const { newPassword, confirmPassword } = this.form.value;
    return confirmPassword && newPassword !== confirmPassword;
  }

  async saveChanges() {
    if (this.form.invalid || this.passwordMismatch()) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitMessage = '';
    this.submitSuccess = false;

    const { currentPassword, newPassword } = this.form.value;

    try {
      await this.authService.changePassword(currentPassword, newPassword);
      this.submitSuccess = true;
      this.modalCtrl.dismiss({ changed: true });
    } catch (error: any) {
      this.submitSuccess = false;
      this.submitMessage = 'Error al cambiar la contraseña.';
    }

    this.isSubmitting = false;
  }
}
