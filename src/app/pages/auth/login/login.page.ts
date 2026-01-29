import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { IonContent } from '@ionic/angular/standalone';
import { LoginForm } from 'src/app/utils/types';
import { AuthLogoComponent } from 'src/app/components/auth-logo/auth-logo.component';
import { WrapperComponent } from 'src/app/components/wrapper/wrapper.component';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: 'login.page.html',
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    IonContent,
    ReactiveFormsModule,
    AuthLogoComponent,
    WrapperComponent,
    RouterLink,
  ],
})
export class LoginPage extends IconBase {
  loginForm!: FormGroup<LoginForm>;

  isLoading: boolean = false;
  errorMessage: string = '';
  showPassword: boolean = false;

  constructor(
    private fb: NonNullableFormBuilder,
    private authService: AuthService,
    private firestore: Firestore,
    private auth: Auth,
    private router: Router
  ) {
    super();
    this.loginForm = this.fb.group({
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  private async createUserDocumentIfNotExists() {
    const user = this.auth.currentUser;
    if (!user) return;
    const ref = doc(this.firestore, `usuarios/${user.uid}`);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        email: user.email,
        name: user.displayName || 'Anonymous',
        createdAt: new Date(),
      });
    }
  }

  login() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Completa todos los campos correctamente.';
      return;
    }

    const { email, password } = this.loginForm.getRawValue();

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(email, password).subscribe({
      next: async () => {
        this.isLoading = false;
        try {
          await this.createUserDocumentIfNotExists();
          await this.router.navigate(['/main/home']);
        } catch (error) {
          console.error('Error al crear documento Firestore:', error);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage =
          'Error al iniciar sesión. Por favor verifica tus credenciales.';
        console.error('Error de inicio de sesión:', error);
      },
    });
  }
}
