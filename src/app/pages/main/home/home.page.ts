import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { LucideAngularModule } from 'lucide-angular';
import { IconBase } from '../../../utils/icons';
import { IonContent, ModalController } from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { HEALTHY_TIPS, HealthyTip } from 'src/app/data/healthy-tips.data';
import { FUN_FACTS, FunFact } from 'src/app/data/fun-facts.data';
import { HEALTH_MYTHS, HealthMyth } from 'src/app/data/health-myths.data';
import { TipModalComponent } from 'src/app/components/tip-modal/tip-modal.component';
import { MythModalComponent } from 'src/app/components/myth-modal/myth-modal.component';
import { User } from 'src/app/utils/types';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    FormsModule,
    CommonModule,
    HeaderComponent,
    LucideAngularModule,
  ], // Importamos FormsModule para usar [(ngModel)]
})
export class HomePage extends IconBase implements OnInit {
  healthyTips = HEALTHY_TIPS;
  funFacts = FUN_FACTS;
  healthMyths = HEALTH_MYTHS;

  selectedTip: HealthyTip | null = null;
  healthyMyth: HealthMyth | null = null;

  selectedFunFact: FunFact | null = null;

  // Usuario actualmente autenticado
  currentUser: User | null = null;

  /**
   * Constructor del componente
   * @param authService - Servicio de autenticación para obtener datos del usuario
   * @param router - Servicio de enrutamiento para navegar entre páginas
   */
  constructor(
    private authService: AuthService,
    private router: Router,
    private modalCtrl: ModalController
  ) {
    super();
  }

  selectFunFact(fact: FunFact) {
    if (this.selectedFunFact?.id === fact.id) {
      this.selectedFunFact = null;
    } else {
      this.selectedFunFact = fact;
    }
  }

  async openTipModal(tip: HealthyTip) {
    this.selectedTip = tip;
    const modal = await this.modalCtrl.create({
      component: TipModalComponent,
      componentProps: {
        title: this.selectedTip.title,
        tip: this.selectedTip,
      },
    });
    await modal.present();
    await modal.onWillDismiss();
  }

  async openMythModal(myth: HealthMyth) {
    this.healthyMyth = myth;
    const modal = await this.modalCtrl.create({
      component: MythModalComponent,
      componentProps: {
        myth: this.healthyMyth,
      },
    });
    await modal.present();
    await modal.onWillDismiss();
  }

  /**
   * Método del ciclo de vida ejecutado al inicializar el componente
   * Obtiene la información del usuario actualmente autenticado
   */
  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
  }

  /**
   * Cierra la sesión del usuario actual y redirige a la página de login
   * Utiliza el método logout() del servicio de autenticación
   */
  logout() {
    this.authService.logout(); // Elimina la sesión del usuario
    this.router.navigate(['/auth/login']); // Redirige a la página de login
  }
}
