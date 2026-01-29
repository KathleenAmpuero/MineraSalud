/**
 * Servicio para gestionar el estado de las preguntas de salud
 *
 * Este servicio se encarga de:
 * - Determinar si un usuario es nuevo y necesita responder las preguntas
 * - Verificar si un usuario ya ha respondido las preguntas de salud
 * - Marcar las preguntas como completadas cuando el usuario termina
 */
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class HealthQuestionsService {
  // Clave para almacenar el estado de las preguntas
  private readonly HEALTH_QUESTIONS_COMPLETED_KEY = 'healthQuestionsCompleted';

  constructor(
    private authService: AuthService,
    private router: Router,
    private storageService: StorageService
  ) {}

  /**
   * Verifica si el usuario actual necesita responder las preguntas de salud
   * @returns boolean - true si el usuario necesita responder las preguntas
   */
  needsToAnswerQuestions(): boolean {
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      return false; // No hay usuario autenticado
    }

    // Verificar si ya completó las preguntas
    return !this.storageService.hasItem(
      `${this.HEALTH_QUESTIONS_COMPLETED_KEY}_${currentUser.id}`
    );
  }

  /**
   * Redirecciona al usuario según si necesita responder preguntas o no
   * @param destinationForExistingUsers - Ruta para usuarios existentes
   */
  redirectBasedOnQuestionStatus(
    destinationForExistingUsers: string = '/main/home'
  ): void {
    if (this.needsToAnswerQuestions()) {
      // Redirigir a la primera pregunta para usuarios nuevos
      this.router.navigate(['/auth/questions/one']);
    } else {
      // Redirigir a la página principal para usuarios existentes
      this.router.navigate([destinationForExistingUsers]);
    }
  }
}
