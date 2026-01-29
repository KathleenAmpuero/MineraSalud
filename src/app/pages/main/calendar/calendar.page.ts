import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  CalendarService,
  HighlightedDate,
} from 'src/app/services/calendar.service';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonDatetime,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonChip,
  ModalController,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { SymptomRecord } from 'src/app/utils/types';
import { DayDetailsComponent } from 'src/app/components/day-details/day-details.component';
import { IconBase } from 'src/app/utils/icons';
import { LucideAngularModule } from 'lucide-angular';

type DayData = {
  day: number;
  dateString: string;
  hasData: boolean;
  isToday: boolean;
  isSelected: boolean;
  color: string | null;
  empty?: boolean;
};

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, HeaderComponent, LucideAngularModule],
})
export class CalendarPage extends IconBase implements OnInit, OnDestroy {
  highlightedDates: HighlightedDate[] = [];
  selectedDayData: SymptomRecord | null = null;
  currentDate = new Date();
  selectedDate: string | null = null;

  private datesSub!: Subscription;

  // Días de la semana
  weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  // Meses del año
  months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  constructor(
    private calendarService: CalendarService,
    private modalCtrl: ModalController
  ) {
    super();
  }

  ngOnInit() {
    this.datesSub = this.calendarService.highlightedDates$.subscribe(
      (dates) => {
        this.highlightedDates = dates;
      }
    );

    this.calendarService.refreshDates();
  }
  ngOnDestroy() {
    if (this.datesSub) {
      this.datesSub.unsubscribe();
    }
  }

  // Obtener días del mes actual
  getDaysInMonth(): any[] {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    // Primer día del mes
    const firstDay = new Date(year, month, 1);
    // Último día del mes
    const lastDay = new Date(year, month + 1, 0);

    // Días vacíos al inicio (para alinear con el día de la semana)
    const startEmpty = firstDay.getDay();

    const days = [];

    // Agregar días vacíos al inicio
    for (let i = 0; i < startEmpty; i++) {
      days.push({ empty: true });
    }

    // Agregar días del mes
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const dateString = `${year}-${String(month + 1).padStart(
        2,
        '0'
      )}-${String(day).padStart(2, '0')}`;
      const hasData = this.highlightedDates.some((h) => h.date === dateString);
      const symptomData = this.highlightedDates.find(
        (h) => h.date === dateString
      );

      days.push({
        day,
        dateString,
        hasData,
        isToday: this.isToday(year, month, day),
        isSelected: this.selectedDate === dateString,
        color: symptomData?.data?.color || null,
      });
    }

    return days;
  }

  // Verificar si es el día de hoy
  isToday(year: number, month: number, day: number): boolean {
    const today = new Date();
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  }

  // Navegar al mes anterior
  previousMonth() {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() - 1
    );
  }

  // Navegar al mes siguiente
  nextMonth() {
    this.currentDate = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1
    );
  }

  // Seleccionar un día
  async selectDay(dayData: DayData) {
    if (dayData.empty) return;

    this.selectedDate = dayData.dateString;

    // Abrir modal directamente - el componente cargará sus propios datos
    await this.openDayDetailsModal(dayData.dateString, null);
  }

  // Abrir modal con detalles del día
  async openDayDetailsModal(dateString: string, dayData: SymptomRecord | null) {
    const modal = await this.modalCtrl.create({
      component: DayDetailsComponent,
      componentProps: {
        selectedDate: dateString,
        // No pasamos dayData ni reportedSymptoms, dejamos que el componente los cargue
      },
      cssClass: 'day-details-modal',
    });

    await modal.present();
  }

  // Obtener síntomas para datos específicos
  private getReportedSymptomsForData(data: SymptomRecord | null): string[] {
    if (!data) return [];
    const symptoms: string[] = [];

    if (data.headache) symptoms.push('Dolor de cabeza');
    if (data.dizziness) symptoms.push('Mareos');
    if (data.nausea) symptoms.push('Náuseas');
    if (data.palpitations) symptoms.push('Palpitaciones');
    if (data.breathingIssue) symptoms.push('Problemas respiratorios');
    if (data.bodyPain) symptoms.push('Dolor corporal');

    return symptoms;
  }

  // Obtener lista limpia de síntomas reportados
  get reportedSymptoms(): string[] {
    if (!this.selectedDayData) return [];
    const symptoms: string[] = [];
    const data = this.selectedDayData;

    if (data.headache) symptoms.push('Dolor de cabeza');
    if (data.dizziness) symptoms.push('Mareos');
    if (data.nausea) symptoms.push('Náuseas');
    if (data.palpitations) symptoms.push('Palpitaciones');
    if (data.breathingIssue) symptoms.push('Problemas respiratorios');
    if (data.bodyPain) symptoms.push('Dolor corporal');

    return symptoms;
  }

  // Obtener el nombre del mes actual
  get currentMonthName(): string {
    return this.months[this.currentDate.getMonth()];
  }

  // Obtener el año actual
  get currentYear(): number {
    return this.currentDate.getFullYear();
  }
}
