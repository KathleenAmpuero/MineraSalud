/**
 * Servicio para manejar el almacenamiento local
 *
 * Encapsula las operaciones de localStorage para mayor modularidad
 */
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  /**
   * Guarda un valor en localStorage
   * @param key Clave de almacenamiento
   * @param value Valor a almacenar
   */
  setItem(key: string, value: any): void {
    localStorage.setItem(
      key,
      typeof value === 'object' ? JSON.stringify(value) : String(value)
    );
  }

  /**
   * Obtiene un valor de localStorage
   * @param key Clave de almacenamiento
   * @param parseJson Si el valor debe ser interpretado como JSON
   * @returns El valor almacenado o null si no existe
   */
  getItem<T>(key: string, parseJson = true): T | null {
    const value = localStorage.getItem(key);

    if (!value) return null;

    if (parseJson) {
      try {
        return JSON.parse(value) as T;
      } catch (error) {
        console.error('Error al parsear valor de localStorage:', error);
        return null;
      }
    }

    return value as unknown as T;
  }

  /**
   * Elimina un valor de localStorage
   * @param key Clave a eliminar
   */
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * Verifica si existe una clave en localStorage
   * @param key Clave a verificar
   * @returns true si existe, false si no
   */
  hasItem(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }
}
