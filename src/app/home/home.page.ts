import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { BarraComponent } from 'src/app/barra/barra.component';
import { SpinnerComponent } from '../spinner/spinner.component';
import { QrscannerService } from '../services/qrscanner.service';
import Swal from 'sweetalert2';
import { ListaEspera } from '../shared/listaEspera.interface';
import { PushnotificationService } from '../services/pushnotification.service';
import { ListaEsperaService } from '../services/lista-espera.service';
import { PedidoService } from '../services/pedido.service';
import { User2 } from '../shared/user2.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, BarraComponent, SpinnerComponent]
})
export class HomePage implements OnInit, OnDestroy {
  user: any = null;
  data: any = null;
  spinner: boolean = true;

  waitlist = true;
  grid = false;

  hasWait: any = null;
  hasRequest: any = null;

  request: Array<any>[] = []
  wait: Array<any>[] = []
  scanActive = false;

  private static activeUser: User2;

  constructor(
    private authService: AuthService,
    private router: Router,
    private qrSrv: QrscannerService,
    private pnSrv: PushnotificationService,
    private listSrv: ListaEsperaService,
    private pedidoSrv: PedidoService
  ) { }

  ngOnInit() {
    this.data = null;
    this.authService.user$.subscribe(data => {
      this.user = data
    });

    let ls = localStorage.getItem('user');
    if (ls != null) {

      let user = JSON.parse(ls);
      this.user = user;
    }
    this.spinner = true;
    this.checkWait();
    this.checkRequest();
  }

  ngOnDestroy(): void {
    this.user = null;
    localStorage.removeItem('user');
  }
  private checkWait() {
    const a = this.listSrv.getLastByUser(this.user.correo)
      .subscribe((data: any[]) => {
        if(data['estado'] !== 'FINALIZADO'){
          this.hasWait = data;
        }

        a.unsubscribe();
      });
  }
  private checkRequest() {
    const a = this.pedidoSrv.getLastByUser(this.user.correo)
      .subscribe((data: any[]) => {
        this.hasRequest = data;
        console.log(this.hasRequest);
        a.unsubscribe();
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

  qrMesa = false;
  escanearQR() {
    this.scanActive = true;
    this.qrSrv.startScan().then((result) => {
      const datos = result.split(' ');
      this.data = { name: datos[0], id: datos[1], }
      if (result === 'ENTRADALOCAL') {
        this.scanActive = false;
        if (!this.hasWait) {
          this.checkWait();

          this.toast('Ingreso al local', 'success', 'Aguarde mientras se le asigna una mesa');
          this.addToWaitList();
          this.pnSrv.enviarNotificacionUsuarios('METRE', 'Ingreso al local', 'Un cliente solicitó la entrada al local', true);
        } else if (this.hasWait.estado == 'PENDIENTE') {
          this.toast('Ya solicitó ingreso al local, espere mientras se evalúa', 'info');
          // this.toastr.warning('Previamente usted ya solicitó una mesa, en breves se le acercará un recepcionista', 'Lista de espera');
        }
        else if (this.hasWait.estado == 'EN USO') {
          this.toast('Ya tiene una mesa reservada', 'info');
          // this.toastr.warning('Usted ya tiene una mesa reservada, por favor consulte al empleado más cercano', 'Lista de espera');
        }
        else if (this.hasWait.estado == 'FINALIZADO') {
          this.toast('Ingresó al local, aguarde mientras se le asigna una mesa', 'success');
          this.addToWaitList();
        }
      } else if (this.data.name === 'MESA') {
        this.scanActive = false;
        

        if (!this.hasRequest) { //  If first time in restaurant
          this.checkRequest();
          this.toast('Primero debe ser aprobado para ingresar al local', 'info');
          // this.toastr.warning('Lo sentimos, primero debe anunciarse en recepción', 'QR');
        }
        else if (this.hasRequest.mesa_numero == this.data.id) {
          this.checkRequest();
          switch (this.hasRequest.estado) {
            case 'PENDIENTE':
              this.router.navigate(['/menu-productos']);
              break;

            case 'ACEPTADO': //Paracee en la lista del cocinero
            case 'PREPARACION'://El cocinero lo pone en preparacion
            case 'COCINADO':
            case 'ENTREGADO':
            case 'CONFIRMADO':
              //this.router.navigate(['/pedido/id/:id' + this.hasRequest.id]);
              this.router.navigate(['/pedido/id/'+this.hasRequest.id]);
              break;

            case 'COBRAR':
              this.toast('Se acercara un mozo a cobrarle', 'success', 'A cobrar');
              // this.toastr.warning('En breves se le acercará un mozo a cobrarle', 'QR');
              break;

            case 'COBRADO':
              // if ((new Date().getTime() - this.hasRequest.date_updated) >= (10 * 60 * 60 * 1000)) {  //  If pass 10 hours of last pedido
              //   this.toastr.presentToast('Se le asignó la mesa Numero: ' + this.hasRequest.mesa_numero, 2000, 'success', 'Cobrado');
              //   // this.toastr.warning('La mesa que se le asignó es: Nº ' + this.hasRequest.mesa_numero, 'QR');
              // }
              // else {  //  If is the table selected
              //   this.router.navigate(['/pedido/id/' + this.hasRequest.id]);
              // }
              this.toast('Ya le cobraron, su mesa quedó liberada', 'success');
              break;

            default:
              this.toast('Le recomendamos que se dirija a recepción para que le asigne una mesa', 'info');
              // this.toastr.warning('Le recomendamos que se dirija a recepción para que le asigne una mesa', 'QR');
              break;
          }
        }
        else {
          this.toast('Esta no es la mesa que tiene asignada', 'info');
        }

      } else {
        this.toast('El QR escaneado es incorrecto', 'error');
        this.scanActive = false;
      }
    })
  }
  stopScan() {
    //this.router.navigate(['/home']);
    this.scanActive = false;
    this.qrSrv.stopScanner();
  }

}



