import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { IconBase } from 'src/app/utils/icons';
import { AuthService } from 'src/app/services/auth.service';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonContent, IonDatetime } from '@ionic/angular/standalone';
import { dateValidator } from 'src/app/utils/validations';
import { CommonModule } from '@angular/common';
import { WrapperComponent } from 'src/app/components/wrapper/wrapper.component';

@Component({
  selector: 'app-question-one',
  templateUrl: './question-one.component.html',
  styleUrl: './question-one.component.scss',
  standalone: true,
  imports: [
    IonContent,
    IonDatetime,
    CommonModule,
    LucideAngularModule,
    FormsModule,
    ReactiveFormsModule,
    WrapperComponent,
  ],
})
export class QuestionOneComponent extends IconBase {
  form = new FormGroup({
    birthday: new FormControl('', [Validators.required, dateValidator]),
  });

  canShowError: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    super();
  }

  ngOnInit() {
    this.form.statusChanges.subscribe((status) => {
      if (status === 'INVALID' && this.form.controls.birthday.value === '') {
        this.canShowError = false;
      }
    });
  }

  async goNextQuestion() {
    this.canShowError = true;
    if (this.form.valid) {
      const birthdayValue = this.form.controls.birthday.value ?? '';
      const birthday = new Date(birthdayValue).toISOString();

      await this.authService.updateBirthdateAndAge(birthday);
      this.router.navigate(['/auth/questions/two']);
    }
  }

  onDateChange(event: any) {
    event.detail.value;
  }
}
