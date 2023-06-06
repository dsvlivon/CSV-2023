import { Component, OnInit } from '@angular/core';
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



expandir() {
  this.mostrarComponente = true;
  this.mostrarColapsar = true;
}

colapsar() {
  this.mostrarComponente = false;
  this.mostrarColapsar = false;
}


async mostrarModalAltas() {
    // Abre el modal y configura mostrarBotonesFlotantes en true
    this.mostrarBotonesFlotantes = true;

    const modal = await this.modalController.create({
      component: ModalAltasComponent,
      cssClass: 'altas-modal'
    });
    modal.onDidDismiss().then(() => {
      // Se cierra el modal, restablece mostrarBotonesFlotantes en false
      this.mostrarBotonesFlotantes = false;
    });
    return await modal.present();
  }



}

