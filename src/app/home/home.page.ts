import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';
import { BarraComponent } from 'src/app/barra/barra.component';
import { SpinnerComponent } from '../spinner/spinner.component';
import { QrscannerService } from '../services/qrscanner.service';
import Swal from 'sweetalert2';
import { ListaEspera } from '../shared/listaEspera.interface';
import { PushnotificationService } from '../services/pushnotification.service';
import { ListaEsperaService } from '../services/lista-espera.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, BarraComponent, SpinnerComponent]
})
export class HomePage implements OnInit, OnDestroy {
  user: any = null;
  spinner: boolean = false;

  waitlist = false;
  grid = false;

  hasWait: any = null;
  scanActive = false;
  currentScan:string[];

  constructor(
    private authService: AuthService,
    private router: Router,
    private firestoreService: FirestoreService,
    private qrSrv: QrscannerService,
    private pnSrv: PushnotificationService,
    private listSrv: ListaEsperaService
  ) { }

  ngOnInit() {
    this.authService.user$.subscribe(data => {
      this.user = data
      console.log(this.user);
    });
    let ls = localStorage.getItem('user');
    if (ls != null) {

      let user = JSON.parse(ls);
      this.user = user;
    }
    this.spinner = true;
  }

  ngOnDestroy(): void {
    this.user = null;
    localStorage.removeItem('user');
  }
  private checkWait() {
    const a = this.listSrv.getLastByUser(this.user.correo)
      .subscribe(data => {
        this.hasWait = data;
      });
  }

  private addToWaitList() {
    try {
      const m = this.createModelWait();
      this.listSrv.createOne(m);

    }
    catch (error) {
    }
  }
  private createModelWait() {
    let m: ListaEspera = {
      id: '',
      estado: 'PENDIENTE',
      correo: this.user.correo,
      date_created: new Date().getTime(),
      user_uid: this.user.uid
    }

    return m;
  }
  async toast(title: string, icono: any, text?: string) {
    await Swal.fire({
      title: title,
      text: text,
      icon: icono,
      timer: 3000,
      toast: true,
      position: 'top',
      grow: 'row',
      showConfirmButton: false,
      timerProgressBar: true
    })
  }
  escanearQR() {
    this.scanActive = true;
    this.qrSrv.startScan().then((result) => {
      console.log(result);
      if (result === 'ENTRADALOCAL') {
        if(!this.hasWait) {
          this.scanActive = false;
          this.waitlist = true;
          this.grid = false
          this.toast('Ingreso al local', 'Aguarde mientras se le asigna una mesa', 'success');
          this.addToWaitList();
          this.pnSrv.enviarNotificacionUsuarios('METRE', 'Ingreso al local', 'Un cliente solicitó la entrada al local', true);
        }
      }
    })
  }
  stopScan() {
    this.scanActive = false;
    this.qrSrv.stopScanner();
  }
}



