/**
 * Servicio para cálculos relacionados con la salud
 *
 * Proporciona funciones para calcular indicadores de salud como el IMC
 * y determinar estados de salud basados en estos indicadores.
 */
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HealthCalculatorService {
  /**
   * Calcula el Índice de Masa Corporal (IMC)
   * @param peso Peso en kilogramos
   * @param altura Altura en centímetros
   * @returns IMC calculado con dos decimales
   */
  calcularIMC(peso: number, altura: number): number {
    // Convertir altura de centímetros a metros
    const alturaMetros = altura / 100;

    // Calcular IMC: peso / altura^2
    const imc = peso / (alturaMetros * alturaMetros);

    // Redondear a dos decimales
    return Math.round(imc * 100) / 100;
  }

  /**
   * Determina el estado de salud según el IMC
   * @param imc Índice de Masa Corporal
   * @returns Descripción del estado de salud
   */
  determinarEstadoSalud(imc: number): string {
    if (imc < 18.5) {
      return 'Bajo peso';
    } else if (imc < 25) {
      return 'Peso normal';
    } else if (imc < 30) {
      return 'Sobrepeso';
    } else {
      return 'Obesidad';
    }
  }
}
