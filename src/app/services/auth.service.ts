import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from '@angular/fire/auth';
import { BehaviorSubject, Observable, from, throwError } from 'rxjs';
import { tap, catchError, map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
// Importaciones de Firebase Color
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';

// Importaciones de los nuevos servicios modulares
import {
  setPersistence,
  browserLocalPersistence,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  updateEmail,
  sendEmailVerification,
} from 'firebase/auth';
import { StorageService } from './storage.service';
import { AuthErrorService } from './auth-error.service';
import { User } from '../utils/types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // BehaviorSubject para mantener el estado del usuario actual
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  // Observable público al que los componentes pueden suscribirse
  public currentUser$ = this.currentUserSubject.asObservable();

  // Claves para almacenamiento
  private readonly STORAGE_KEY = 'mineraSalud_user';
  private readonly HEALTH_QUESTIONS_COMPLETED_KEY = 'healthQuestionsCompleted';

  constructor(
    private auth: Auth,
    private router: Router,
    private storageService: StorageService,
    private errorService: AuthErrorService,
    private firestore: Firestore
  ) {
    this.configurePersistence();
    this.checkForStoredUser();
    this.setupAuthListener();
  }

  /**
   * Configura la persistencia local para mantener la sesión
   */
  private configurePersistence(): void {
    setPersistence(this.auth, browserLocalPersistence)
      .then(() => {
        console.log('Persistencia configurada correctamente');
      })
      .catch((error) => {
        console.error('Error al configurar persistencia:', error);
      });
  }

  private async fetchExtraUserData(id: string): Promise<Partial<User>> {
    const userDoc = await getDoc(doc(this.firestore, 'usuarios', id));
    if (userDoc.exists()) {
      return userDoc.data() as Partial<User>;
    }
    return {};
  }

  /**
   * Configura listener para cambios en la autenticación
   */
  private setupAuthListener(): void {
    onAuthStateChanged(this.auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Obtener datos extra desde Firestore
        const extraData = await this.fetchExtraUserData(firebaseUser.uid);

        // Construir objeto de usuario completo
        const user: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || '',
          avatar: extraData.avatar || 'variant1W10',
          age: extraData.age || 0,
          height: extraData.height || 0,
          weight: extraData.weight || 0,
          bmi: extraData.bmi || 0,
        };

        // Guardar en localStorage y actualizar estado global
        this.storageService.setItem(this.STORAGE_KEY, user);
        this.currentUserSubject.next(user);
      } else {
        // Usuario no autenticado
        this.storageService.removeItem(this.STORAGE_KEY);
        this.currentUserSubject.next(null);
      }
    });
  }

  /**
   * Verifica si hay usuario en localStorage
   */
  private checkForStoredUser(): void {
    const storedUser = this.storageService.getItem<User>(this.STORAGE_KEY);

    if (storedUser && storedUser.id) {
      this.currentUserSubject.next(storedUser);
    } else {
      // Si no hay usuario válido, limpiar almacenamiento
      this.storageService.removeItem(this.STORAGE_KEY);
      this.currentUserSubject.next(null);
    }
  }

  /**
   * Inicia sesión con email y contraseña
   * @param email Email del usuario
   * @param password Contraseña
   */
  login(email: string, password: string): Observable<User> {
    return from(setPersistence(this.auth, browserLocalPersistence)).pipe(
      switchMap(() => this.performLogin(email, password)),
      catchError(this.handleAuthError.bind(this))
    );
  }

  /**
   * Realiza el proceso de inicio de sesión
   */
  private performLogin(email: string, password: string): Observable<User> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap(async (userCredential) => {
        const firebaseUser = userCredential.user;
        const extraData = await this.fetchExtraUserData(firebaseUser.uid);

        const user: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || '',
          avatar: extraData.avatar || 'variant1W10',
          age: extraData.age || 0,
          height: extraData.height || 0,
          weight: extraData.weight || 0,
          bmi: extraData.bmi || 0,
        };

        this.storageService.setItem(this.STORAGE_KEY, user);
        this.currentUserSubject.next(user);

        return user;
      })
    );
  }

  /**
   * Registra un nuevo usuario
   * @param email Email del nuevo usuario
   * @param password Contraseña
   * @param name Nombre del usuario
   */
  register(email: string, password: string, name: string): Observable<User> {
    return from(setPersistence(this.auth, browserLocalPersistence)).pipe(
      switchMap(() => this.createUserAndUpdateProfile(email, password, name)),
      catchError(this.handleAuthError.bind(this))
    );
  }

  /**
   * Crea un usuario y actualiza su perfil
   */
  private createUserAndUpdateProfile(
    email: string,
    password: string,
    name: string
  ): Observable<User> {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password)
    ).pipe(
      switchMap((userCredential) => {
        return from(
          updateProfile(userCredential.user, { displayName: name })
        ).pipe(
          map(() => {
            const user: User = {
              id: userCredential.user.uid,
              email: userCredential.user.email || '',
              name: name,
              avatar: 'variant1W10',
            };

            this.storageService.setItem(this.STORAGE_KEY, user);
            this.currentUserSubject.next(user);

            this.router.navigate(['/auth/questions/one']);

            return user;
          })
        );
      })
    );
  }

  /**
   * Maneja errores de autenticación
   */
  private handleAuthError(error: any) {
    console.error('Error de autenticación:', error);
    const message = this.errorService.getAuthErrorMessage(error.code || '');
    return throwError(() => new Error(message));
  }

  /**
   * Recuperación de contraseña
   * @param email Correo electrónico para recuperar contraseña
   */
  resetPassword(email: string): Observable<boolean> {
    return from(sendPasswordResetEmail(this.auth, email)).pipe(
      map(() => true),
      catchError(this.handleAuthError.bind(this))
    );
  }
  /**
   * Actualiza los datos del perfil del usuario
   * @param name Nombre del usuario
   * @param email Email del usuario
   */
  async updateProfileData(
    id: string,
    name: string,
    email: string,
    avatar: string,
    age: number
  ): Promise<void> {
    const currentUser = this.getCurrentUser();

    const user = this.auth.currentUser;
    if (user) {
      if (user.displayName !== name) {
        await updateProfile(user, { displayName: name });
      }

      const userRef = doc(this.firestore, 'usuarios', id);
      await setDoc(
        userRef,
        {
          name,
          email,
          avatar,
          age,
          ...(currentUser?.birthdate
            ? { birthDate: currentUser.birthdate }
            : {}),
          ...(currentUser?.height ? { height: currentUser.height } : {}),
          ...(currentUser?.weight ? { weight: currentUser.weight } : {}),
          ...(currentUser?.bmi ? { bmi: currentUser.bmi } : {}),
        },
        { merge: true }
      );
      // Actualizar el usuario en el almacenamiento local
      const updatedUser: User = {
        id: user.uid,
        email: email || '',
        name: user.displayName || '',
        avatar: avatar,
        age: age,
        birthdate: currentUser?.birthdate,
        height: currentUser?.height,
        weight: currentUser?.weight,
        bmi: currentUser?.bmi,
      };
      console.log('Actualizando usuario:', updatedUser);
      this.storageService.setItem(this.STORAGE_KEY, updatedUser);
      this.currentUserSubject.next(updatedUser);
    }
  }

  async updateBMI({
    height,
    weight,
    bmi,
  }: {
    height: number;
    weight: number;
    bmi: number;
  }): Promise<void> {
    try {
      const currentUser = this.getCurrentUser();
      const userRef = doc(this.firestore, 'usuarios', currentUser?.id!);

      const safeUser: Partial<User> = {
        bmi,
        height,
        weight,
        ...(currentUser?.birthdate ? { birthdate: currentUser.birthdate } : {}),
        ...(currentUser?.name ? { name: currentUser.name } : {}),
        ...(currentUser?.email ? { email: currentUser.email } : {}),
        ...(currentUser?.avatar ? { avatar: currentUser.avatar } : {}),
        ...(currentUser?.age !== undefined ? { age: currentUser.age } : {}),
      };

      await setDoc(userRef, safeUser, { merge: true });

      // Actualizar el usuario en el almacenamiento local
      if (currentUser) {
        const updatedUser: User = {
          ...currentUser,
          height,
          weight,
          bmi,
        };
        this.storageService.setItem(this.STORAGE_KEY, updatedUser);
        this.currentUserSubject.next(updatedUser);
      }
    } catch (error) {
      console.error('Error al actualizar BMI:', error);
      throw error;
    }
  }

  /**
   * Actualiza la fecha de nacimiento y la edad del usuario en Firestore y localStorage
   * @param id ID del usuario
   * @param birthDate Fecha de nacimiento en formato 'YYYY-MM-DD'
   */
  async updateBirthdateAndAge(birthdate: string): Promise<void> {
    // Calcular edad
    const currentUser = this.getCurrentUser();
    const birth = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    // Actualiza en Firestore
    const userRef = doc(this.firestore, 'usuarios', currentUser?.id!);

    await setDoc(userRef, { ...currentUser, birthdate, age }, { merge: true });

    if (currentUser && currentUser.id === currentUser?.id) {
      const updatedUser: User = {
        ...currentUser,
        birthdate,
        age,
      };
      this.storageService.setItem(this.STORAGE_KEY, updatedUser);
      this.currentUserSubject.next(updatedUser);
    }
  }

  /**
   * Cambia la contraseña del usuario autenticado
   */
  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    console.log({ newPassword });
    try {
      const user = this.auth.currentUser;
      if (!user || !user.email) throw new Error('Usuario no autenticado.');

      // Reautenticación
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      console.log('Reautenticando usuario:', user.email);
      await reauthenticateWithCredential(user, credential);

      // Cambiar contraseña
      const newPass = await updatePassword(user, newPassword);
      console.log('Contraseña cambiada exitosamente:', newPass);
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error);
      throw error;
    }
  }

  /**
   * Cierra la sesión del usuario actual
   */
  logout(): Observable<void> {
    return from(signOut(this.auth)).pipe(
      tap(() => {
        this.storageService.removeItem(this.STORAGE_KEY);
        this.currentUserSubject.next(null);
        this.router.navigate(['/auth/login'], {
          replaceUrl: true,
        });
      }),
      catchError((error) => {
        console.error('Error al cerrar sesión:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Verifica si hay un usuario autenticado
   * @returns boolean - true si el usuario está autenticado, false en caso contrario
   */
  isAuthenticated(): boolean {
    // Verificar el estado interno primero
    const currentUser = this.currentUserSubject.value;
    if (currentUser) return true;

    // Verificar Firebase
    const firebaseUser = this.auth.currentUser;
    if (this.syncFirebaseUser(firebaseUser)) return true;

    // Verificar localStorage como último recurso
    return this.checkStoredUserAuthentication();
  }

  /**
   * Sincroniza el usuario de Firebase con el estado local
   * @returns true si se sincronizó un usuario, false si no
   */
  private syncFirebaseUser(firebaseUser: any): boolean {
    if (firebaseUser) {
      (async () => {
        const extraData = await this.fetchExtraUserData(firebaseUser.uid);

        const user: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || '',
          avatar: extraData.avatar || 'variant1W10',
          age: extraData.age || 0,
        };

        this.storageService.setItem(this.STORAGE_KEY, user);
        this.currentUserSubject.next(user);
      })();

      return true;
    }
    return false;
  }

  /**
   * Verifica autenticación desde almacenamiento local
   */
  private checkStoredUserAuthentication(): boolean {
    const storedUser = this.storageService.getItem<User>(this.STORAGE_KEY);
    if (storedUser && storedUser.id) {
      this.currentUserSubject.next(storedUser);
      return true;
    }
    return false;
  }

  /**
   * Obtiene los datos del usuario autenticado
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
