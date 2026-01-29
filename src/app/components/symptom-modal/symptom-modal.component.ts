import { Component, Input } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { ModalController } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { translateSymptomOptions } from 'src/app/utils/translate';

@Component({
  selector: 'app-symptom-modal',
  templateUrl: './symptom-modal.component.html',
  styleUrls: ['./symptom-modal.component.scss'],
  standalone: true,
  imports: [HeaderComponent, CommonModule],
})
export class SymptomModalComponent {
  @Input() title!: string;
  @Input() options!: string[];
  @Input() selectedValue!: string | null;
  @Input() type!: 'hydration' | 'sleep' | 'weight' | 'diet';

  constructor(private modalController: ModalController) {}

  translateOption(option: string): string {
    return translateSymptomOptions(this.type, option);
  }

  selectOption(option: string) {
    if (this.selectedValue === option) {
      this.selectedValue = null;
    } else {
      this.selectedValue = option;
    }
  }

  confirmAndClose() {
    this.modalController.dismiss(
      {
        type: this.type,
        value: this.selectedValue,
      },
      'confirm'
    );
  }
}
