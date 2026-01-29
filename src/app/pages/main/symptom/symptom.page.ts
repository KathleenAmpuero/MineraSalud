import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, ModalController } from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { LucideAngularModule } from 'lucide-angular';
import { IconBase } from 'src/app/utils/icons';
import { SymptomModalComponent } from 'src/app/components/symptom-modal/symptom-modal.component';
import { translateSymptomSections } from 'src/app/utils/translate';
import { ToastController } from '@ionic/angular/standalone';
import {
  BloodPressure,
  BodyPain,
  Diet,
  Energy,
  Hydratation,
  Mood,
  PhysicalActivity,
  Sleep,
  SymptomOption,
  Weight,
} from 'src/app/utils/types';
import { SymptomService } from 'src/app/services/symptom.service';
import { CalendarService } from 'src/app/services/calendar.service';

@Component({
  selector: 'app-symptom',
  templateUrl: './symptom.page.html',
  styleUrls: ['./symptom.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    HeaderComponent,
    LucideAngularModule,
  ],
})
export class SymptomPage extends IconBase implements OnInit {
  currentDate: string = new Date().toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Estado General
  hydration: Hydratation = null;
  sleep: Sleep = null;
  weight: Weight = null;
  diet: Diet = null;

  // Estado emocional
  mood: Mood = null;

  // Estado físico
  energy: Energy = null;
  bodyPain: BodyPain = null;
  headache: boolean = false;
  breathingIssue: boolean = false;
  nausea: boolean = false;

  // Salud cardiovascular
  palpitations: boolean = false;
  bloodPressure: BloodPressure = null;
  dizziness: boolean = false;

  // Hábitos y riesgos
  smokes: boolean = false;
  drinksAlcohol: boolean = false;
  usesDrugs: boolean = false;

  // Otros
  tookMedication: boolean = false;
  recentMedicalCheckup: boolean = false;
  hadAccident: boolean = false;
  physicalActivity: PhysicalActivity = null;

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
    private symptomService: SymptomService,
    private calendarService: CalendarService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) {
    super();
  }

  async showSuccessToast() {
    const toast = await this.toastCtrl.create({
      message: 'Guardado con éxito',
      duration: 2000,
      position: 'top',
      color: 'success',
    });
    toast.present();
  }

  ngOnInit() {
    this.symptomService.getRecordByDate$(new Date()).subscribe({
      next: (record) => {
        if (record) {
          this.hydration = record.hydration ?? null;
          this.sleep = record.sleep ?? null;
          this.weight = record.weight ?? null;
          this.diet = record.diet ?? null;
          this.mood = record.mood ?? null;
          this.energy = record.energy ?? null;
          this.bodyPain = record.bodyPain ?? null;
          this.headache = record.headache ?? false;
          this.breathingIssue = record.breathingIssue ?? false;
          this.nausea = record.nausea ?? false;
          this.palpitations = record.palpitations ?? false;
          this.bloodPressure = record.bloodPressure ?? null;
          this.dizziness = record.dizziness ?? false;
          this.smokes = record.smokes ?? false;
          this.drinksAlcohol = record.drinksAlcohol ?? false;
          this.usesDrugs = record.usesDrugs ?? false;
          this.tookMedication = record.tookMedication ?? false;
          this.recentMedicalCheckup = record.recentMedicalCheckup ?? false;
          this.hadAccident = record.hadAccident ?? false;
          this.physicalActivity = record.physicalActivity ?? null;
          console.log('✅ Registro diario cargado:', record);
        } else {
          console.log('ℹ️ No hay registro para hoy.');
        }
      },
      error: (error) =>
        console.error('❌ Error al cargar el registro diario:', error),
    });
  }

  async openOptionModal(type: SymptomOption) {
    const modal = await this.modalCtrl.create({
      component: SymptomModalComponent,
      componentProps: {
        title: `Selecciona ${translateSymptomSections(type)}`,
        options: this.optionsMap[type],
        selectedValue: this[type],
        type: type,
      },
      breakpoints: [0, 1],
      initialBreakpoint: 1,
    });

    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm' && data) {
      this[data.type as 'hydration' | 'sleep' | 'weight' | 'diet'] = data.value;
    }
  }

  // 🔁 Guardado
  async save() {
    const data = {
      hydration: this.hydration,
      sleep: this.sleep,
      weight: this.weight,
      diet: this.diet,
      mood: this.mood,
      energy: this.energy,
      bodyPain: this.bodyPain,
      headache: this.headache,
      breathingIssue: this.breathingIssue,
      nausea: this.nausea,
      palpitations: this.palpitations,
      bloodPressure: this.bloodPressure,
      dizziness: this.dizziness,
      smokes: this.smokes,
      drinksAlcohol: this.drinksAlcohol,
      usesDrugs: this.usesDrugs,
      tookMedication: this.tookMedication,
      recentMedicalCheckup: this.recentMedicalCheckup,
      hadAccident: this.hadAccident,
      physicalActivity: this.physicalActivity,
      timestamp: new Date(),
    };

    console.log('💾 Intentando guardar datos:', data);

    try {
      // Usar lastValueFrom para convertir el Observable a Promise
      await new Promise((resolve, reject) => {
        this.symptomService.saveDailyRecord$(data).subscribe({
          next: (result) => {
            console.log('✅ Datos guardados exitosamente:', result);
            resolve(true);
          },
          error: (error) => {
            console.error('❌ Error en saveDailyRecord$:', error);
            reject(error);
          },
        });
      });

      console.log('🎉 Guardado completado, mostrando toast...');
      // Mostrar toast de éxito
      await this.showSuccessToast();

      console.log('🗓️ Actualizando calendario...');
      // Actualizar el calendario y esperar a que termine
      await this.calendarService.refreshDates();
      console.log('✅ Calendario actualizado');
    } catch (error) {
      console.error('❌ Error al guardar el registro diario:', error);
    }
  }

  isEmpty(): boolean {
    return (
      this.hydration === null &&
      this.sleep === null &&
      this.weight === null &&
      this.diet === null &&
      this.mood === null &&
      this.energy === null &&
      this.bodyPain === null &&
      !this.headache &&
      !this.breathingIssue &&
      !this.nausea &&
      !this.palpitations &&
      this.bloodPressure === null &&
      !this.dizziness &&
      !this.smokes &&
      !this.drinksAlcohol &&
      !this.usesDrugs &&
      !this.tookMedication &&
      !this.recentMedicalCheckup &&
      !this.hadAccident &&
      this.physicalActivity === null
    );
  }
}
