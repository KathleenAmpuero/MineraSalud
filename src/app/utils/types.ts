import type { FormControl } from '@angular/forms';

export type RegisterForm = {
  name: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
};

export type LoginForm = {
  email: FormControl<string>;
  password: FormControl<string>;
};

export type ResetPasswordForm = {
  email: FormControl<string>;
};

export type User = {
  id: string;
  email: string;
  name: string;
  age?: number;
  avatar?: string;
  height?: number;
  weight?: number;
  bmi?: number;
  birthdate?: string;
};

export type BmiCategory =
  | 'Bajo peso'
  | 'Peso normal'
  | 'Sobrepeso'
  | 'Obesidad';

export type SymptomRecord = {
  id: string;
  color: string;
  bloodPressure?: string;
  bodyPain?: string;
  breathingIssue?: boolean;
  diet?: string;
  dizziness?: boolean;
  drinksAlcohol?: boolean;
  energy?: string;
  hadAccident?: boolean;
  headache?: boolean;
  hydration?: string;
  mood?: string;
  nausea?: boolean;
  palpitations?: boolean;
  physicalActivity?: string;
  recentMedicalCheckup?: boolean;
  sleep?: string;
  smokes?: boolean;
  tookMedication?: boolean;
  usesDrugs?: boolean;
  weight?: string;
  timestamp?: any;
};

export type SymptomOption =
  | 'hydration'
  | 'sleep'
  | 'weight'
  | 'diet'
  | 'mood'
  | 'energy'
  | 'bodyPain'
  | 'headache'
  | 'breathingIssue'
  | 'nausea'
  | 'palpitations'
  | 'bloodPressure'
  | 'dizziness'
  | 'smokes'
  | 'drinksAlcohol'
  | 'usesDrugs'
  | 'tookMedication'
  | 'recentMedicalCheckup'
  | 'hadAccident'
  | 'physicalActivity';

export type Hydratation = 'low' | 'adequate' | 'high' | null;
export type Sleep = 'good' | 'regular' | 'poor' | null;
export type Weight = 'low' | 'normal' | 'high' | null;
export type Diet = 'healthy' | 'fast food' | 'greasy' | 'skipped' | null;
export type Mood =
  | 'happy'
  | 'calm'
  | 'apathetic'
  | 'irritable'
  | 'stressed'
  | 'sad'
  | null;
export type Energy = 'high' | 'medium' | 'low' | null;
export type BodyPain = 'muscular' | 'joint' | 'back' | 'neck' | null;
export type BloodPressure = 'high' | 'low' | null;
export type PhysicalActivity = 'none' | 'light' | 'moderate' | 'intense' | null;

export type DailySymptomRecord = {
  timestamp: Date;
  hydration: Hydratation;
  sleep: Sleep;
  weight: Weight;
  diet: Diet;
  mood: Mood;
  energy: Energy;
  bodyPain: BodyPain;
  headache: boolean;
  breathingIssue: boolean;
  nausea: boolean;
  palpitations: boolean;
  bloodPressure: BloodPressure;
  dizziness: boolean;
  smokes: boolean;
  drinksAlcohol: boolean;
  usesDrugs: boolean;
  tookMedication: boolean;
  recentMedicalCheckup: boolean;
  hadAccident: boolean;
  physicalActivity: PhysicalActivity;
  color: string;
};
