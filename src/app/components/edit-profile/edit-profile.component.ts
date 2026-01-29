import { Component, Input, NgModule, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { IonContent, ModalController } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { IconBase } from 'src/app/utils/icons';
import { User } from 'src/app/utils/types';
import { AuthService } from 'src/app/services/auth.service';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
  standalone: true,
  imports: [
    HeaderComponent,
    IonContent,
    CommonModule,
    LucideAngularModule,
    ReactiveFormsModule,
  ],
})
export class EditProfileComponent extends IconBase implements OnInit {
  @Input() user!: User;

  form!: FormGroup;
  avatarOptions = [
    'variant1W10',
    'variant2W12',
    'variant3W14',
    'variant4W16',
    'variant6W10',
    'variant7W12',
    'variant8W14',
    'variant9W16',
  ];
  selectedAvatar = this.avatarOptions[0];

  constructor(
    private modalCtrl: ModalController,
    private authService: AuthService,
    private fb: NonNullableFormBuilder
  ) {
    super();
  }

  ngOnInit() {
    console.log('EditProfileComponent initialized with user:', this.user);
    if (!this.user) {
      console.error('No se recibió el usuario');
      return;
    }

    this.selectedAvatar = this.user.avatar || this.avatarOptions[0];

    this.form = this.fb.group({
      name: [
        this.user.name ?? '',
        [Validators.required, Validators.minLength(2)],
      ],
      email: [this.user.email ?? '', [Validators.required, Validators.email]],
      age: [this.user.age ?? 0, [Validators.required, Validators.min(10)]],
    });
  }
  private modalObserver?: MutationObserver;

  ngAfterViewInit() {
    // Inhabilitar router-outlet
    const outlet = document.querySelector('ion-router-outlet');
    outlet?.setAttribute('inert', 'true');

    // Detectar cambios en el modal y eliminar aria-hidden si aparece
    const ionModal = document.querySelector('ion-modal');

    if (ionModal) {
      this.modalObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.type === 'attributes' &&
            mutation.attributeName === 'aria-hidden' &&
            ionModal.hasAttribute('aria-hidden')
          ) {
            ionModal.removeAttribute('aria-hidden');
          }
        });
      });

      this.modalObserver.observe(ionModal, {
        attributes: true,
        attributeFilter: ['aria-hidden'],
      });

      // También quitar inmediatamente si ya lo tiene
      if (ionModal.hasAttribute('aria-hidden')) {
        ionModal.removeAttribute('aria-hidden');
      }
    }
  }

  ngOnDestroy() {
    const outlet = document.querySelector('ion-router-outlet');
    outlet?.removeAttribute('inert');

    this.modalObserver?.disconnect();
  }

  hasError(controlName: string, error: string) {
    const control = this.form.get(controlName);
    return control?.touched && control?.hasError(error);
  }

  async saveChanges() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, email, age } = this.form.getRawValue();

    try {
      console.log('Datos a guardar:', {
        id: this.user.id,
        name,
        email,
        avatar: this.selectedAvatar,
        age,
      });

      await this.authService.updateProfileData(
        this.user.id,
        name,
        email,
        this.selectedAvatar,
        age
      );

      this.modalCtrl.dismiss({
        updated: {
          ...this.user,
          name,
          email,
          age,
          avatar: this.selectedAvatar,
        },
      });
    } catch (e) {
      console.error('Error al guardar los cambios:', e);
      alert('Error al guardar');
    }
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
