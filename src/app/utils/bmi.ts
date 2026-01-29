import { BmiCategory } from './types';

export const MIN_HEIGHT = 100;
export const MAX_HEIGHT = 220;
export const MIN_WEIGHT = 30;
export const MAX_WEIGHT = 200;

export function getBMI(height: number, weight: number): number {
  if (height && weight && height > 0) {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  }
  return 0;
}

export function getBmiCategory(bmi: number): BmiCategory {
  if (bmi < 18.5) {
    return 'Bajo peso';
  } else if (bmi >= 18.5 && bmi < 24.9) {
    return 'Peso normal';
  } else if (bmi >= 25 && bmi < 29.9) {
    return 'Sobrepeso';
  } else {
    return 'Obesidad';
  }
}

export function formatBmi(bmi: number): string {
  return bmi.toFixed(1);
}
