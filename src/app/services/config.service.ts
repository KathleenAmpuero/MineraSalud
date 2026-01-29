/**
 * Servicio de Configuración del Sistema
 *
 * Este servicio se encarga de:
 * - Inicializar la estructura de la base de datos
 * - Gestionar configuraciones globales
 * - Garantizar la existencia de colecciones necesarias
 */
import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  serverTimestamp,
} from '@angular/fire/firestore';
import {
  Auth,
  createUserWithEmailAndPassword,
  updateProfile,
} from '@angular/fire/auth';
import { from, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  // Nombres de las colecciones en Firestore
  private readonly COLLECTIONS = {
    AUTH_USERS: 'authUsers',
    MINEROS: 'mineros',
    SETTINGS: 'settings',
  };

  // Usuario administrador por defecto (solo para inicialización)
  private readonly DEFAULT_ADMIN = {
    email: 'admin@minerasalud.cl',
    name: 'Administrador',
    password: 'admin123',
    role: 'admin',
    active: true,
  };

  constructor(private firestore: Firestore, private auth: Auth) {}

  /**
   * Inicializa la estructura de la base de datos
   * @returns Promesa que se resuelve cuando se completa la inicialización
   */
  public initializeDatabase(): Promise<void> {
    console.log('Inicializando base de datos...');
    return this.verifyAndCreateAdminUser()
      .then(() => this.ensureCollectionsExist())
      .catch((error) => {
        console.error('Error en la inicialización de la base de datos:', error);
        return Promise.reject(error);
      });
  }

  /**
   * Verifica si existe un usuario admin y, si no, lo crea
   */
  private async verifyAndCreateAdminUser(): Promise<void> {
    try {
      console.log('Verificando usuarios administradores...');
      const usersRef = collection(this.firestore, this.COLLECTIONS.AUTH_USERS);
      const q = query(usersRef, where('role', '==', 'admin'));
      const querySnapshot = await getDocs(q);

      console.log(
        `Se encontraron ${querySnapshot.size} usuarios administradores`
      );

      // Si no hay usuarios admin, crear uno por defecto
      if (querySnapshot.empty) {
        console.log(
          'No hay usuarios administradores. Creando usuario por defecto...'
        );
        try {
          // Crear usuario en Firebase Auth
          const userCredential = await createUserWithEmailAndPassword(
            this.auth,
            this.DEFAULT_ADMIN.email,
            this.DEFAULT_ADMIN.password
          );

          console.log(
            'Usuario creado en Authentication:',
            userCredential.user.uid
          );

          // Actualizar el perfil con el nombre del usuario
          await updateProfile(userCredential.user, {
            displayName: this.DEFAULT_ADMIN.name,
          });

          console.log('Perfil actualizado correctamente');

          // Guardar información adicional en Firestore
          const userData = {
            email: this.DEFAULT_ADMIN.email,
            name: this.DEFAULT_ADMIN.name,
            role: this.DEFAULT_ADMIN.role,
            active: this.DEFAULT_ADMIN.active,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          };

          const userDocRef = doc(
            this.firestore,
            this.COLLECTIONS.AUTH_USERS,
            userCredential.user.uid
          );

          await setDoc(userDocRef, userData);
          console.log(
            'Usuario administrador creado correctamente en Firestore'
          );
        } catch (error: any) {
          console.error('Error al crear el usuario administrador:', error);

          // Si el usuario ya existe, continuar el proceso
          if (error.code === 'auth/email-already-in-use') {
            console.log('El usuario administrador ya existe.');
          } else {
            // Para otros errores, propagar la excepción
            throw error;
          }
        }
      } else {
        console.log('Ya existe al menos un usuario administrador');
      }

      return Promise.resolve();
    } catch (error) {
      console.error('Error al verificar usuarios administradores:', error);
      return Promise.reject(error);
    }
  }

  /**
   * Asegura que todas las colecciones necesarias existan en Firestore
   * Si no existen, crea documentos iniciales para establecerlas
   */
  async ensureCollectionsExist(): Promise<void> {
    console.log('Verificando que las colecciones necesarias existan...');

    try {
      // Verificar cada colección e inicializarla si es necesario
      await this.verifyAndInitCollection(this.COLLECTIONS.AUTH_USERS);
      await this.verifyAndInitCollection(this.COLLECTIONS.MINEROS);

      // Para la colección settings, crear un documento específico
      await this.verifyAndInitSettingsCollection();

      console.log('Verificación de colecciones completada con éxito');
      return Promise.resolve();
    } catch (error) {
      console.error('Error al verificar/crear colecciones:', error);
      return Promise.reject(error);
    }
  }

  /**
   * Verifica si una colección existe y la inicializa si es necesario
   * @param collectionName Nombre de la colección a verificar
   */
  private async verifyAndInitCollection(collectionName: string): Promise<void> {
    const collectionRef = collection(this.firestore, collectionName);
    const docs = await getDocs(collectionRef);

    console.log(`Colección ${collectionName}: ${docs.size} documentos`);

    if (docs.empty) {
      console.log(
        `Colección ${collectionName} vacía o no existe. Creando documento inicial...`
      );

      // Crear documento inicial
      const tempDocRef = doc(collectionRef);
      await setDoc(tempDocRef, {
        _init: true,
        createdAt: serverTimestamp(),
        description:
          'Documento de inicialización de colección. Puede eliminarse.',
      });

      console.log(`Se creó un documento inicial en ${collectionName}`);
    }
  }

  /**
   * Verifica e inicializa la colección de configuraciones
   */
  private async verifyAndInitSettingsCollection(): Promise<void> {
    const settingsRef = collection(this.firestore, this.COLLECTIONS.SETTINGS);
    const settingsDocs = await getDocs(settingsRef);

    console.log(
      `Colección ${this.COLLECTIONS.SETTINGS}: ${settingsDocs.size} documentos`
    );

    if (settingsDocs.empty) {
      console.log(
        `Colección ${this.COLLECTIONS.SETTINGS} vacía o no existe. Creando documento inicial...`
      );

      // Crear documento de configuración específico
      const tempDocRef = doc(settingsRef, 'app_settings');
      await setDoc(tempDocRef, {
        appName: 'MineraSalud',
        version: '1.0.0',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      console.log(
        `Se creó un documento inicial en ${this.COLLECTIONS.SETTINGS}`
      );
    }
  }

  /**
   * Obtiene las configuraciones de la aplicación
   * @returns Observable con las configuraciones
   */
  getAppSettings(): Observable<any> {
    const settingsRef = doc(
      this.firestore,
      this.COLLECTIONS.SETTINGS,
      'app_settings'
    );
    return from(getDoc(settingsRef)).pipe(
      map((docSnap) => {
        if (docSnap.exists()) {
          return docSnap.data();
        }
        return null;
      }),
      catchError((error) => {
        console.error('Error al obtener configuraciones:', error);
        throw error;
      })
    );
  }
}
