import { Component, Input, OnInit } from '@angular/core';
import {
  IonContent,
  ModalController,
  ToastController,
} from '@ionic/angular/standalone';
import { DailySymptomRecord, SymptomRecord } from 'src/app/utils/types';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { IconBase } from 'src/app/utils/icons';
import {
  translateSymptomOptions,
  translateSymptomSections,
} from 'src/app/utils/translate';
import { SymptomModalComponent } from '../symptom-modal/symptom-modal.component';
import { SymptomService } from 'src/app/services/symptom.service';

@Component({
  selector: 'app-day-details',
  templateUrl: './day-details.component.html',
  styleUrls: ['./day-details.component.scss'],
  standalone: true,
  imports: [HeaderComponent, IonContent, CommonModule, LucideAngularModule],
})
export class DayDetailsComponent extends IconBase implements OnInit {
  @Input() selectedDate!: string;
  @Input() dayData!: DailySymptomRecord | null;
  @Input() reportedSymptoms!: string[];

  formattedDate = '';

  optionsMap = {
    hydration: ['low', 'adequate', 'high'],
    sleep: ['good', 'regular', 'poor'],
    weight: ['low', 'normal', 'high'],
    diet: ['healthy', 'fast food', 'greasy', 'skipped'],
    mood: ['happy', 'calm', 'apathetic', 'irritable', 'stressed', 'sad'],
    energy: ['high', 'medium', 'low'],
    bodyPain: ['muscular', 'joint', 'back', 'neck'],
    headache: [true, false],
    breathingIssue: [true, false],
    nausea: [true, false],
    palpitations: [true, false],
    bloodPressure: ['high', 'low'],
    dizziness: [true, false],
    smokes: [true, false],
    drinksAlcohol: [true, false],
    usesDrugs: [true, false],
    tookMedication: [true, false],
    recentMedicalCheckup: [true, false],
    hadAccident: [true, false],
    physicalActivity: ['none', 'light', 'moderate', 'intense'],
  };

  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private symptomService: SymptomService
  ) {
    super();
  }

  refreshData() {
    if (!this.selectedDate) return;

    // Convertir la fecha string (yyyy-MM-dd) a Date
    const [year, month, day] = this.selectedDate.split('-').map(Number);
    const dateToLoad = new Date(year, month - 1, day);

    this.symptomService.getRecordByDate$(dateToLoad).subscribe({
      next: (record) => {
        if (record) {
          this.dayData = record;
          this.reportedSymptoms = this.buildReportedSymptomsList();
        }
      },
      error: (error) => console.error('Error al refrescar datos:', error),
    });
  }

  ngOnInit() {
    if (this.selectedDate) {
      const [year, month, day] = this.selectedDate.split('-').map(Number);
      const fixedDate = new Date(year, month - 1, day);

      this.formattedDate = fixedDate.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

      // Cargar los datos automáticamente al inicializar
      this.loadData();
    }
    console.log('🔄 Día seleccionado:', this.selectedDate);
    console.log('📊 Datos del día:', this.dayData);
    console.log('📝 Síntomas reportados:', this.reportedSymptoms);
  }

  // Nuevo método para cargar datos
  private loadData() {
    if (!this.selectedDate) return;

    const [year, month, day] = this.selectedDate.split('-').map(Number);
    const dateToLoad = new Date(year, month - 1, day);

    this.symptomService.getRecordByDate$(dateToLoad).subscribe({
      next: (record) => {
        this.dayData = record;
        this.reportedSymptoms = this.buildReportedSymptomsList();
        console.log('📊 Datos cargados:', this.dayData);
        console.log('📝 Síntomas reportados:', this.reportedSymptoms);
      },
      error: (error) => console.error('Error al cargar datos:', error),
    });
  }

  private buildReportedSymptomsList(): string[] {
    if (!this.dayData) return [];

    const symptoms: string[] = [];

    // Síntomas con opciones múltiples
    if (this.dayData.hydration) {
      symptoms.push(
        `Hidratación: ${this.translate('hydration', this.dayData.hydration)}`
      );
    }
    if (this.dayData.sleep) {
      symptoms.push(`Sueño: ${this.translate('sleep', this.dayData.sleep)}`);
    }
    if (this.dayData.weight) {
      symptoms.push(`Peso: ${this.translate('weight', this.dayData.weight)}`);
    }
    if (this.dayData.diet) {
      symptoms.push(`Dieta: ${this.translate('diet', this.dayData.diet)}`);
    }
    if (this.dayData.mood) {
      symptoms.push(
        `Estado de ánimo: ${this.translate('mood', this.dayData.mood)}`
      );
    }
    if (this.dayData.energy) {
      symptoms.push(
        `Energía: ${this.translate('energy', this.dayData.energy)}`
      );
    }
    if (this.dayData.bodyPain) {
      symptoms.push(
        `Dolor corporal: ${this.translate('bodyPain', this.dayData.bodyPain)}`
      );
    }
    if (this.dayData.bloodPressure) {
      symptoms.push(
        `Presión arterial: ${this.translate(
          'bloodPressure',
          this.dayData.bloodPressure
        )}`
      );
    }
    if (this.dayData.physicalActivity) {
      symptoms.push(
        `Actividad física: ${this.translate(
          'physicalActivity',
          this.dayData.physicalActivity
        )}`
      );
    }

    // Síntomas booleanos
    if (this.dayData.headache) symptoms.push('Cefalea');
    if (this.dayData.breathingIssue) symptoms.push('Problemas respiratorios');
    if (this.dayData.nausea) symptoms.push('Náuseas');
    if (this.dayData.palpitations) symptoms.push('Palpitaciones');
    if (this.dayData.dizziness) symptoms.push('Mareos');
    if (this.dayData.smokes) symptoms.push('Consumo de cigarrillo');
    if (this.dayData.drinksAlcohol) symptoms.push('Consumo de alcohol');
    if (this.dayData.usesDrugs) symptoms.push('Consumo de drogas');
    if (this.dayData.tookMedication) symptoms.push('Medicación');
    if (this.dayData.recentMedicalCheckup) symptoms.push('Control médico');
    if (this.dayData.hadAccident) symptoms.push('Accidente');

    return symptoms;
  }

  async openOptionModal(type: string) {
    if (!this.dayData) return;

    // Implementación similar a symptom.page.ts pero en modo solo lectura
    const modal = await this.modalCtrl.create({
      component: SymptomModalComponent,
      componentProps: {
        title: `Detalle: ${translateSymptomSections(type)}`,
        options: this.optionsMap[type as keyof typeof this.optionsMap] || [],
        selectedValue: this.dayData[type as keyof DailySymptomRecord],
        type: type,
        readOnly: true, // Modo solo lectura
      },
      breakpoints: [0, 1],
      initialBreakpoint: 1,
    });

    await modal.present();
  }

  getGeneralCount(): number {
    if (!this.dayData) return 0;
    const symptoms = [
      this.dayData.hydration,
      this.dayData.sleep,
      this.dayData.weight,
      this.dayData.diet,
    ];
    return symptoms.filter((symptom) => symptom).length;
  }

  getPhysicalSymptomsCount(): number {
    if (!this.dayData) return 0;

    const symptoms = [
      this.dayData.energy,
      this.dayData.bodyPain,
      this.dayData.headache,
      this.dayData.breathingIssue,
      this.dayData.nausea,
    ];

    return symptoms.filter((symptom) => symptom).length;
  }

  getCardiovascularSymptomsCount(): number {
    if (!this.dayData) return 0;

    const symptoms = [
      this.dayData.bloodPressure,
      this.dayData.palpitations,
      this.dayData.dizziness,
    ];

    return symptoms.filter((symptom) => symptom).length;
  }

  getHabitsAndRisksCount(): number {
    if (!this.dayData) return 0;

    const symptoms = [
      this.dayData.smokes,
      this.dayData.drinksAlcohol,
      this.dayData.usesDrugs,
    ];

    return symptoms.filter((symptom) => symptom).length;
  }

  getOtherCount(): number {
    if (!this.dayData) return 0;

    const symptoms = [
      this.dayData.tookMedication,
      this.dayData.recentMedicalCheckup,
      this.dayData.hadAccident,
      this.dayData.physicalActivity,
    ];

    return symptoms.filter((symptom) => symptom).length;
  }

  translate(type: string, value: string): string {
    return translateSymptomOptions(type, value);
  }

  translateSection(section: string): string {
    return translateSymptomSections(section);
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
