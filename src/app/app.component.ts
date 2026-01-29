/**
 * Componente Principal de la Aplicación MineraSalud
 *
 * Este es el componente raíz que contiene toda la aplicación.
 * Se encarga de:
 * - Inicializar la aplicación
 * - Redirigir al usuario a la página adecuada según su estado de autenticación
 * - Proporcionar el contenedor principal donde se renderizarán las demás vistas
 */
import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { HealthQuestionsService } from './services/health-questions.service';

@Component({
  selector: 'app-root', // Selector principal que se usa en index.html
  standalone: true, // Componente standalone (característica de Angular moderno)
  imports: [
    IonApp, // Componente raíz de Ionic
    IonRouterOutlet, // Contenedor donde se mostrarán las diferentes páginas
    CommonModule, // Módulo con directivas comunes de Angular
  ],
  // Template mínimo que solo contiene el marco de la aplicación Ionic
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  /**
   * Constructor del componente principal
   *
   * @param authService - Servicio para verificar el estado de autenticación
   * @param router - Servicio para la navegación
   * @param fireAuth - Servicio de Firebase Auth
   * @param healthQuestionsService - Servicio para gestionar las preguntas de salud
   */
  constructor(
    private authService: AuthService,
    private router: Router,
    private fireAuth: Auth,
    private healthQuestionsService: HealthQuestionsService
  ) {}

  /**
   * Método del ciclo de vida que se ejecuta al iniciar la aplicación
   * Verifica si hay un usuario autenticado y redirige según corresponda
   */
  ngOnInit() {
    // Esperar a que Firebase Auth se inicialice completamente
    onAuthStateChanged(this.fireAuth, (firebaseUser) => {
      console.log('Firebase Auth state changed:', firebaseUser);
      if (firebaseUser) {
        // Si hay un usuario autenticado en Firebase, usar el servicio de preguntas de salud
        // para determinar a dónde redirigir
        // ARREGLAR!!!!
        /* this.healthQuestionsService.redirectBasedOnQuestionStatus(); */
      } else {
        // Verificar si tenemos un usuario en nuestro servicio de autenticación
        // esto es importante para manejar la primera carga cuando Firebase aún no ha inicializado
        if (this.authService.isAuthenticated()) {
          this.healthQuestionsService.redirectBasedOnQuestionStatus();
        } else {
          // Si no está autenticado, limpiar cualquier dato de sesión residual
          // y redirigir al login
          const storageKey = this.authService['STORAGE_KEY'];
          if (storageKey) {
            localStorage.removeItem(storageKey);
          }

          this.router.navigate(['/auth/login']);
        }
      }
    });
  }
}
