/**
 * Guard de Autenticación
 *
 * Este guard protege las rutas que requieren que el usuario esté autenticado.
 * Se encarga de verificar si hay una sesión activa antes de permitir el acceso a una ruta.
 * Si el usuario no está autenticado, lo redirige automáticamente a la página de login.
 */
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root', // Disponible en toda la aplicación
})
export class AuthGuard implements CanActivate {
  /**
   * Constructor del guard de autenticación
   *
   * @param authService - Servicio que verifica el estado de autenticación
   * @param router - Servicio para manejar la navegación y redirecciones
   */
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Método requerido por la interfaz CanActivate
   * Determina si una ruta puede ser activada o no
   *
   * @returns boolean | UrlTree
   *   - true: si el usuario está autenticado (permite acceso)
   *   - UrlTree: objeto de redirección a /login (niega acceso)
   */
  canActivate(): boolean | UrlTree {
    // Verifica si el usuario está autenticado usando el servicio
    if (this.authService.isAuthenticated()) {
      // Si está autenticado
      return true;
    } else {
      // Si no está autenticado, redirige al login
      // createUrlTree crea un objeto especial para la redirección
      return this.router.createUrlTree(['/auth/login']);
    }
  }
}
