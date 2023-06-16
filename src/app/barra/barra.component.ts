import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AnimationController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-barra',
  templateUrl: './barra.component.html',
  styleUrls: ['./barra.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})

export class BarraComponent implements OnInit {

  user: any = null;
  mostrarComponente: boolean = false;
  mostrarColapsar: boolean = false;
  mostrarBotonesFlotantes = false;

  authSrv = inject(AuthService);

  constructor(
    private animationCtrl: AnimationController,
    private authService: AuthService,
    private router: Router,
    private modalController: ModalController
  ) { }

  ngOnInit() {

    this.authService.user$.subscribe(data => {
      this.user = data
    });
    let ls = localStorage.getItem('user');
    if (ls != null) {
      let user = JSON.parse(ls);
      this.user = user;
    }

  }

  goAltas() { this.router.navigate(['/altas']); }

  goEncuestas() { this.router.navigate(['/encuestas']); }

  goGestion() { this.router.navigate(['/lista-usuarios']); }

  goDelivery() { this.router.navigate(['/delivery']); }

  goJuegos() { this.router.navigate(['/juegos']); }

  goQr() { this.router.navigate(['/lector-qr']); }

  goHome() { this.router.navigate(['/home']); }

  logOut() {
    this.authService.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigateByUrl('login', { replaceUrl: true})

    });
  }





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

  altaCliente(tipo: string) {
    this.authSrv.tipo = tipo;
    this.router.navigate(['/alta-cliente']);
  }

  altaSupervisor() {
    this.authSrv.tipo = 'anonimo';
    this.router.navigate(['/alta-supervisor']);
  }

  altaEmpleado() {
    this.authSrv.tipo = 'anonimo';
    this.router.navigate(['/alta-empleado']);
  }


}


