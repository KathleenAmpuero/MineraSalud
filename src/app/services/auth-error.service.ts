/**
 * Servicio para gestionar errores de autenticación
 *
 * Convierte códigos de error de Firebase en mensajes amigables
 */
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthErrorService {
  /**
   * Obtiene un mensaje de error amigable basado en el código de error de Firebase
   * @param errorCode Código de error de Firebase
   * @returns Mensaje de error en español
   */
  getAuthErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'Usuario no encontrado';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta';
      case 'auth/invalid-email':
        return 'Email inválido';
      case 'auth/email-already-in-use':
        return 'El correo electrónico ya está registrado';
      case 'auth/weak-password':
        return 'La contraseña es muy débil';
      case 'auth/requires-recent-login':
        return 'Por seguridad, inicie sesión nuevamente para completar esta acción';
      case 'auth/too-many-requests':
        return 'Demasiados intentos fallidos. Intente más tarde';
      case 'auth/network-request-failed':
        return 'Error de conexión. Verifique su conexión a internet';
      default:
        return `Error en la autenticación: ${errorCode}`;
    }
  }
}
