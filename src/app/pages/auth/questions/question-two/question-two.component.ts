import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { IconBase } from 'src/app/utils/icons';
import { IonContent, ToastController } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { BmiCategory } from 'src/app/utils/types';
import { getBMI, getBmiCategory } from 'src/app/utils/bmi';
import { WrapperComponent } from 'src/app/components/wrapper/wrapper.component';

@Component({
  selector: 'app-question-two',
  templateUrl: './question-two.component.html',
  styleUrls: ['./question-two.component.scss'],
  standalone: true,
  imports: [
    IonContent,
    CommonModule,
    FormsModule,
    DecimalPipe,
    LucideAngularModule,
    WrapperComponent,
  ],
})
export class QuestionTwoComponent extends IconBase implements OnInit {
  height = 170;
  weight = 70;

  /** Resultados de IMC */
  bmi: number = 0;
  bmiCategory: BmiCategory = 'Peso normal';

  /** Constantes para validación */
  readonly MIN_HEIGHT = 100;
  readonly MAX_HEIGHT = 220;
  readonly MIN_WEIGHT = 30;
  readonly MAX_WEIGHT = 200;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastCtrl: ToastController
  ) {
    super();
  }

  /**
   * Inicializa el componente y calcula el IMC
   */
  ngOnInit(): void {
    this.calculateBMI();
  }

  /**
   * Cambia la altura en pasos de 1 cm
   * @param step Valor a añadir o restar (ej: 1, -1)
   */
  changeHeight(step: number): void {
    const newHeight = this.height + step;
    if (this.isValidHeight(newHeight)) {
      this.height = newHeight;
      this.calculateBMI();
    }
  }

  calculateBMI(): void {
    this.bmi = getBMI(this.height, this.weight);
    this.setBmiCategory();
  }

  /**
   * Determina la categoría de IMC basada en el valor calculado
   */
  private setBmiCategory(): void {
    this.bmiCategory = getBmiCategory(this.bmi);
  }

  /**
   * Verifica si una altura está dentro de los rangos válidos
   * @param height Altura a verificar
   * @returns true si la altura es válida
   */
  private isValidHeight(height: number): boolean {
    return height >= this.MIN_HEIGHT && height <= this.MAX_HEIGHT;
  }

  /**
   * Cambia el peso en pasos de 1 kg
   * @param step Valor a añadir o restar (ej: 1, -1)
   */
  changeWeight(step: number): void {
    const newWeight = this.weight + step;
    if (this.isValidWeight(newWeight)) {
      this.weight = newWeight;
      this.calculateBMI();
    }
  }

  /**
   * Verifica si un peso está dentro de los rangos válidos
   * @param weight Peso a verificar
   * @returns true si el peso es válido
   */
  private isValidWeight(weight: number): boolean {
    return weight >= this.MIN_WEIGHT && weight <= this.MAX_WEIGHT;
  }

  /**
   * Verifica si los datos son válidos para continuar
   * @returns true si los datos están completos y válidos
   */
  isValid(): boolean {
    return (
      !!this.height &&
      !!this.weight &&
      this.isValidHeight(this.height) &&
      this.isValidWeight(this.weight)
    );
  }

  async completeQuestionToast() {
    const toast = await this.toastCtrl.create({
      message: 'Cuenta creada exitosamente',
      cssClass: 'custom-toast',
      duration: 1500,
      position: 'top',
    });

    await toast.present();
  }

  /**
   * Guarda los datos de salud y completa el cuestionario
   */
  completeQuestions(): void {
    if (this.isValid()) {
      try {
        this.authService.updateBMI({
          height: this.height,
          weight: this.weight,
          bmi: this.bmi,
        });
        this.completeQuestionToast();
        this.router.navigate(['/main/home']);
      } catch (error) {
        console.error('Error al completar el cuestionario:', error);
      }
    }
  }
}
