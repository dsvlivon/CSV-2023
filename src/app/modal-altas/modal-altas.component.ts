import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-modal-altas',
  templateUrl: './modal-altas.component.html',
  styleUrls: ['./modal-altas.component.scss'],
  standalone: true,
  imports: [
    IonicModule, CommonModule
  ]
})
export class ModalAltasComponent {

  mostrarBotonesFlotantes = false;
  constructor(
    private modalController: ModalController,
    private router: Router,
    ) {}

  dismiss() {
    this.modalController.dismiss();
  }

  altaCliente(){ this.router.navigate(['/app-alta-cliente']); }
  altaSupervisor(){ this.router.navigate(['/app-altas']); }
  altaEmpleado(){ this.router.navigate(['/app-altas']); }

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