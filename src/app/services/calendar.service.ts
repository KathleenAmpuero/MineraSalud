import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { SymptomService } from './symptom.service';
import { DailySymptomRecord } from '../utils/types';

export interface HighlightedDate {
  date: string;
  textColor: string;
  backgroundColor: string;
  data?: DailySymptomRecord;
}

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private highlightedDatesSubject = new BehaviorSubject<HighlightedDate[]>([]);
  highlightedDates$ = this.highlightedDatesSubject.asObservable();

  constructor(
    private symptomService: SymptomService,
    private authService: AuthService
  ) {}
  // Método para obtener y emitir nuevos datos al observable
  refreshDates(): Promise<HighlightedDate[]> {
    console.log('🔄 Iniciando refreshDates...');

    return new Promise((resolve) => {
      const user = this.authService.getCurrentUser();

      if (!user) {
        console.log('⚠️ No hay usuario autenticado');
        this.highlightedDatesSubject.next([]);
        resolve([]);
        return;
      }

      console.log('👤 Usuario encontrado, obteniendo registros...');

      this.symptomService
        .getAllRecords$()
        .pipe(
          map((records) => {
            console.log('📊 Registros obtenidos:', records);
            return records.map(
              (record: DailySymptomRecord & { id: string; color?: string }) => {
                const color = (record as any).color || 'primary';
                const backgroundColor = `var(--ion-color-${color})`;
                return {
                  date: record.id,
                  textColor: '#ffffff',
                  backgroundColor,
                  data: record,
                };
              }
            );
          }),
          catchError((err) => {
            console.error('❌ Error al actualizar fechas del calendario:', err);
            return of([]);
          })
        )
        .subscribe((highlightedDates) => {
          console.log('📅 Fechas destacadas generadas:', highlightedDates);
          this.highlightedDatesSubject.next(highlightedDates);
          resolve(highlightedDates);
        });
    });
  }
}
