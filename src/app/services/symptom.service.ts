import { Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  DocumentData,
} from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { formatDate } from '@angular/common';
import { AuthService } from './auth.service';
import { from, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SymptomService {
  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private authService: AuthService
  ) {}

  saveDailyRecord$(data: any, date: Date = new Date()): Observable<void> {
    const user = this.auth.currentUser;
    if (!user) return from(Promise.reject('User not authenticated'));

    const userId = user.uid;
    const dateId = formatDate(date, 'yyyy-MM-dd', 'en-US');
    const ref = doc(
      this.firestore,
      `usuarios/${userId}/registros_diarios/${dateId}`
    );

    console.log(`📡 Guardando en Firestore...`, data, userId, dateId);

    return from(
      setDoc(ref, {
        ...data,
        timestamp: new Date(),
      }).then(() => {
        console.log(
          `✔ Registro guardado en usuarios/${userId}/registros_diarios/${dateId}`
        );
      })
    );
  }

  getRecordByDate$(date: Date): Observable<any> {
    const userId = this.authService.getCurrentUser()?.id;
    if (!userId) return of(null);

    const dateId = formatDate(date, 'yyyy-MM-dd', 'en-US');
    const ref = doc(
      this.firestore,
      `usuarios/${userId}/registros_diarios/${dateId}`
    );

    return from(getDoc(ref)).pipe(
      map((snap) => (snap.exists() ? snap.data() : null))
    );
  }

  getAllRecords$(): Observable<any[]> {
    const userId = this.authService.getCurrentUser()?.id;
    if (!userId) return of([]);

    const ref = collection(
      this.firestore,
      `usuarios/${userId}/registros_diarios`
    );

    return from(getDocs(ref)).pipe(
      map((snap) => snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    );
  }
}
