import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ListaEsperaService } from 'src/app/services/lista-espera.service';
import { PushnotificationService } from 'src/app/services/pushnotification.service';
import { QrscannerService } from 'src/app/services/qrscanner.service';
import { ListaEspera } from 'src/app/shared/listaEspera.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ScannerComponent implements OnInit, OnDestroy {

  @Input() escanear = false;
  @Input() qrHide = false;
  @Input() listaEspera = false;

  user = null;
  data = null;
  hasWait;

  constructor(private qrSrv: QrscannerService,
    private router: Router,
    private listSrv: ListaEsperaService,
    private pnSrv: PushnotificationService) { }

  ngOnInit() {
    this.user = null;
    this.user = JSON.parse(localStorage.getItem('user'));
    console.log(this.user);
    this.checkWait();
  }

  ngOnDestroy() {
    this.data = null;
  }



  private checkWait() {
    const a = this.listSrv.getLastByUser(this.user.correo)
      .subscribe(data => {
        console.log(data);
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
  async escanearQR() {
    this.escanear = true;
    this.qrSrv.startScan().then((result) => {
      const datos = result.split(' ');
      this.data = { name: datos[0] }
      console.log(this.data);
      if (this.data) {
        switch (this.data.name) {

          case 'ENTRADALOCAL':
            
            if (!this.hasWait) {
              this.toast('Ingreso al local', 'Aguarde mientras se le asigna una mesa', 'success');
              this.addToWaitList();
              this.pnSrv.enviarNotificacionUsuarios('METRE', 'Ingreso al local', 'Un cliente solicitó la entrada al local', true);
              this.listaEspera = true;
              this.qrHide = false;
              this.escanear = false;
              
            } else if(this.hasWait === 'PENDIENTE'){

            }
            break;

        }
      }

    })
  }
}
