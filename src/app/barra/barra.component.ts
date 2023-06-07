import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AnimationController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ModalAltasComponent } from '../modal-altas/modal-altas.component';


@Component({
  selector: 'app-barra',
  templateUrl: './barra.component.html',
  styleUrls: ['./barra.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})

export class BarraComponent  implements OnInit {

  mostrarComponente: boolean = false;
  mostrarColapsar: boolean = false;
  mostrarBotonesFlotantes = false;

  authSrv = inject(AuthService);

  constructor(
    private animationCtrl: AnimationController,
    private authService: AuthService, 
    private router: Router,
    private modalController: ModalController
) {}

ngOnInit() {}

goAltas(){ this.router.navigate(['/altas']); }

goEncuestas(){ this.router.navigate(['/encuestas']); } 

goGestion(){ this.router.navigate(['/gestion']); }

goDelivery(){ this.router.navigate(['/delivery']); }

goJuegos(){ this.router.navigate(['/juegos']); }

goQr(){ this.router.navigate(['/app-lector-qr']); }

logOut() { this.authService.signOut(); }


altaCliente(){ this.router.navigate(['/app-alta-cliente']); }
altaSupervisor(){ this.router.navigate(['/app-altas']); }
altaEmpleado(){ this.router.navigate(['/app-altas']); }


expandir() {
  this.mostrarComponente = true;
  this.mostrarColapsar = true;
}

colapsar() {
  this.mostrarComponente = false;
  this.mostrarColapsar = false;
}

enterAnimation = (baseEl: HTMLElement) => {
  const root = baseEl.shadowRoot;

  const backdropAnimation = this.animationCtrl
    .create()
    .addElement(root.querySelector('ion-backdrop')!)
    .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

  const wrapperAnimation = this.animationCtrl
    .create()
    .addElement(root.querySelector('.modal-wrapper')!)
    .keyframes([
      { offset: 0, opacity: '0', transform: 'scale(0)' },
      { offset: 1, opacity: '0.99', transform: 'scale(1)' },
    ]);

  return this.animationCtrl
    .create()
    .addElement(baseEl)
    .easing('ease-out')
    .duration(500)
    .addAnimation([backdropAnimation, wrapperAnimation]);
};

leaveAnimation = (baseEl: HTMLElement) => {
  return this.enterAnimation(baseEl).direction('reverse');
};

seleccionarTipo(tipo: string) {
  this.authSrv.tipo = tipo;
  this.router.navigate(['/alta-cliente']);
  
}








//deprecado
// async mostrarModalAltas() {
//     // Abre el modal y configura mostrarBotonesFlotantes en true
//     this.mostrarBotonesFlotantes = true;

//     const modal = await this.modalController.create({
//       component: ModalAltasComponent,
//       cssClass: 'altas-modal'
//     });
//     modal.onDidDismiss().then(() => {
//       this.mostrarBotonesFlotantes = false;
//     });
//     return await modal.present();
//   }
}


