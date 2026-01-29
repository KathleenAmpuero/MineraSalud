/**
 * Rutas de la Aplicación MineraSalud
 *
 * Este archivo define las rutas de navegación de la aplicación, configurando:
 * - Qué componente debe cargarse para cada URL
 * - Qué rutas requieren autenticación para ser accesibles
 * - Las redirecciones automáticas
 *
 * Utiliza lazy loading (carga diferida) para mejorar el rendimiento
 * cargando los componentes solo cuando son necesarios.
 */
import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { PublicGuard } from './public.guard';

export const routes: Routes = [
  // ===== Rutas de autenticación (públicas) =====
  // Estas rutas son accesibles sin necesidad de estar autenticado

  /**
   * Ruta para el inicio de sesión (login)
   * URL: /login
   */
  {
    path: 'auth',
    loadComponent: () =>
      import('./pages/auth/auth.page').then((m) => m.AuthPage),
    canActivate: [PublicGuard], // Protegida por PublicGuard
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./pages/auth/login/login.page').then((c) => c.LoginPage),
      },
      /**
       * Ruta para el registro de nuevos usuarios
       * URL: /register
       */
      {
        path: 'register',
        loadComponent: () =>
          import('./pages/auth/register/register.page').then(
            (c) => c.RegisterPage
          ),
      },
      /**
       * Ruta para la recuperación de contraseña
       * URL: /reset-password
       */
      {
        path: 'reset-password',
        loadComponent: () =>
          import('./pages/auth/reset-password/reset-password.page').then(
            (c) => c.ResetPasswordPage
          ),
      },
      /**
       * Rutas para las preguntas de salud (después del registro)
       * Protegidas por AuthGuard
       */
      {
        path: 'questions',
        loadComponent: () =>
          import('./pages/auth/questions/questions.page').then(
            (m) => m.QuestionsPage
          ),
        children: [
          {
            path: 'one',
            loadComponent: () =>
              import(
                './pages/auth/questions/question-one/question-one.component'
              ).then((c) => c.QuestionOneComponent),
          },
          {
            path: 'two',
            loadComponent: () =>
              import(
                './pages/auth/questions/question-two/question-two.component'
              ).then((c) => c.QuestionTwoComponent),
          },
        ],
      },
    ],
  },
  {
    path: 'main',
    loadComponent: () =>
      import('./pages/main/main.page').then((m) => m.MainPage),
    canActivate: [AuthGuard], // Protegida por AuthGuard
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/main/home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/main/profile/profile.page').then(
            (m) => m.ProfilePage
          ),
      },
      {
        path: 'symptom',
        loadComponent: () =>
          import('./pages/main/symptom/symptom.page').then(
            (m) => m.SymptomPage
          ),
      },
      {
        path: 'calendar',
        loadComponent: () =>
          import('./pages/main/calendar/calendar.page').then(
            (m) => m.CalendarPage
          ),
      },
    ],
  },

  /**
   * Redirección de la ruta raíz a la página de login
   * Cuando se accede a la URL base, redirige automáticamente a /login
   */
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },

  /**
   * Redirección de rutas no encontradas
   * Si se accede a una ruta que no existe, redirige a /login
   * El doble asterisco (**) captura cualquier ruta no definida anteriormente
   */
  {
    path: '**',
    redirectTo: 'auth/login',
  },
];
