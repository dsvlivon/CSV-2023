import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnimationController, IonicModule } from '@ionic/angular';
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
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, BarraComponent, SpinnerComponent]
})
export class HomePage implements OnInit {
  user: User2 = null;
  data: any = null;
  spinner: boolean = true;
  mostrarComponente: boolean = false;
  mostrarColapsar: boolean = false;
  us: any;
  hasWait: any = null;
  hasRequest: any = null;

  request: Array<any>[] = []
  wait: Array<any>[] = []
  scanActive = false;

  private static activeUser: User2;

  constructor(
    private animationCtrl: AnimationController,
    private authService: AuthService,
    private router: Router,
    private qrSrv: QrscannerService,
    private pnSrv: PushnotificationService,
    private listSrv: ListaEsperaService,
    private pedidoSrv: PedidoService
  ) { }

  ngOnInit() {
    this.data = null;
    this.user = this.authService.getUser();
    console.log(this.user.correo);
    this.spinner = true;

    this.checkWait();
    this.checkRequest();

  }


  private checkWait() {
    console.log(this.user.correo);
    const a = this.listSrv.getLastByUser(this.user.correo)
      .subscribe((data: any) => {
        if (data?.estado !== 'FINALIZADO') {
          console.log(data);
          this.hasWait = data;
          console.log(this.hasWait)
          a.unsubscribe();
        }

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
        console.log(this.hasWait);
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
              this.router.navigate(['/pedido/id/' + this.hasRequest.id]);
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


  /* BARRA */
  goAltas() { this.router.navigate(['/altas']); }

  goEncuestas() { this.router.navigate(['/encuestas']); }

  goGestion() { this.router.navigate(['/lista-usuarios']); }

  goDelivery() { this.router.navigate(['/delivery']); }

  goJuegos() { this.router.navigate(['/juegos']); }

  goQr() { this.router.navigate(['/lector-qr']); }

  goHome() { this.router.navigate(['/home']); }

  goConsultas() { this.router.navigate(['/consultas']); }

  goClientes() { this.router.navigate(['/gestion-metre'])}

  goListaPedidos() {this.router.navigate(['/lista-pedidos'])}
  
  logOut() {
    
      this.authService.signOut().then(() => {
        this.router.navigateByUrl('login', { replaceUrl: true})
        this.spinner = false;
  
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
    this.authService.tipo = tipo;
    this.router.navigate(['/alta-cliente']);
  }

  altaSupervisor() {
    this.authService.tipo = 'anonimo';
    this.router.navigate(['/alta-supervisor']);
  }

  altaEmpleado() {
    this.authService.tipo = 'anonimo';
    this.router.navigate(['/alta-empleado']);
  }

}



