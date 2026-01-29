import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { LucideAngularModule } from 'lucide-angular';
import { IconBase } from '../../../utils/icons';
import { IonContent } from '@ionic/angular/standalone';
import { passwordPattern } from 'src/app/utils/validations';
import { RegisterForm } from 'src/app/utils/types';
import { RouterLink } from '@angular/router';
import { AuthLogoComponent } from 'src/app/components/auth-logo/auth-logo.component';
import { WrapperComponent } from 'src/app/components/wrapper/wrapper.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    LucideAngularModule,
    ReactiveFormsModule,
    RouterLink,
    AuthLogoComponent,
    WrapperComponent,
  ],
  templateUrl: 'register.page.html', // Plantilla HTML del componente
})
export class RegisterPage extends IconBase {
  registerForm!: FormGroup<RegisterForm>;
  isLoading: boolean = false;
  errorMessage: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private fb: NonNullableFormBuilder,
    private authService: AuthService
  ) {
    super();
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(passwordPattern),
          ],
        ],

        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  private passwordsMatchValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const group = control as FormGroup;
    const password = group.controls['password']?.value;
    const confirmPassword = group.controls['confirmPassword']?.value;

    return password === confirmPassword ? null : { mismatch: true };
  };

  register() {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Completa todos los campos correctamente.';
      return;
    }

    const { name, email, password } = this.registerForm.getRawValue();

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register(email, password, name).subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        if (error.code === 'auth/email-already-in-use') {
          this.errorMessage = 'Este correo electrónico ya está registrado.';
        } else if (error.code === 'auth/invalid-email') {
          this.errorMessage = 'Correo electrónico inválido.';
        } else if (error.code === 'auth/weak-password') {
          this.errorMessage =
            'La contraseña es demasiado débil. Debe tener al menos 6 caracteres.';
        } else if (error.code === 'auth/network-request-failed') {
          this.errorMessage =
            'Error de conexión. Verifica tu conexión a internet.';
        } else {
          this.errorMessage =
            'Error al registrar usuario: ' +
            (error.message || 'Intenta nuevamente.');
        }
        console.error('Error de registro:', error);
      },
    });
  }
}
