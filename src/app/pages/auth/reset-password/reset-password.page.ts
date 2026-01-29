import { Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { LucideAngularModule } from 'lucide-angular';
import { IconBase } from 'src/app/utils/icons';
import { IonContent } from '@ionic/angular/standalone';
import { AuthLogoComponent } from 'src/app/components/auth-logo/auth-logo.component';
import { ResetPasswordForm } from 'src/app/utils/types';
import { Auth, sendPasswordResetEmail } from '@angular/fire/auth';
import { WrapperComponent } from 'src/app/components/wrapper/wrapper.component';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    LucideAngularModule,
    IonContent,
    AuthLogoComponent,
    ReactiveFormsModule,
    WrapperComponent,
  ],
  templateUrl: 'reset-password.page.html',
})
export class ResetPasswordPage extends IconBase {
  resetForm!: FormGroup<ResetPasswordForm>;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: NonNullableFormBuilder,
    private auth: Auth,
    private router: Router
  ) {
    super();
    this.resetForm = this.fb.group({
      email: this.fb.control('', [Validators.required, Validators.email]),
    });
  }

  resetPassword() {
    if (this.resetForm.invalid) {
      this.errorMessage = 'Por favor completa el campo correctamente.';
      return;
    }

    const { email } = this.resetForm.getRawValue();
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.auth.languageCode = 'es';

    sendPasswordResetEmail(this.auth, email)
      .then(() => {
        this.isLoading = false;
        this.successMessage = `Se han enviado instrucciones de recuperación a ${email}. Por favor revisa tu bandeja de entrada.`;
      })
      .catch((error) => {
        this.isLoading = false;
        this.errorMessage =
          'Error al enviar las instrucciones. Por favor intenta nuevamente.';
        console.error('Error al recuperar contraseña:', error);
      });
  }
}
