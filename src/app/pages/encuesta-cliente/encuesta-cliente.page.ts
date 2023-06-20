import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FirestoreService } from 'src/app/services/firestore.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { Pedido } from 'src/app/shared/pedido.interface';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-encuesta-cliente',
  templateUrl: './encuesta-cliente.page.html',
  styleUrls: ['./encuesta-cliente.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class EncuestaClientePage implements OnInit {

  opinion: string = "";
  protocoloCovid: boolean;
  request$: Observable<any>;

  yaEnvioEncuesta: boolean = false;
  user;
  constructor(
    private authSrv: AuthService,
    private router: Router,
    private db: FirestoreService,
    private pedidoService: PedidoService,
    public navCtrl: NavController
    ) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.yaEnvioEncuesta = false;

    this.getLastPedido();
  }

  getLastPedido() {
    this.request$ = this.pedidoService.getLastByUser(this.user.correo);
  }

  redirectTo(path: string) {
    this.router.navigate([path]);
  }

  //falta meter la funcion al boton de escaneo qr que me lleve a los graficos
  navigateBack(){
    this.navCtrl.back();
  }
  customCounterFormatter(inputLength: number, maxLength: number) {
    return `${maxLength - inputLength} caracteres`;
  }


  enviarEncuesta(request: Pedido) {
    var rangoSatisfecho = (<HTMLIonRangeElement>document.getElementById("rango")).value;
    var limpieza = (<HTMLIonRangeElement>document.getElementById("limpieza")).value;

    var selectString = (<HTMLIonSelectElement>document.getElementById("select")).value;
    var opinion = (<HTMLIonSelectElement>document.getElementById("opinion")).value;
    var clienteNombre = this.user.nombre;
    var id_cliente = this.user.uid;

    var json = {
      "id_cliente": id_cliente,
      "id_pedido": request.id,
      "cliente": clienteNombre,
      "rangoSatisfecho": rangoSatisfecho,
      "rangoLimpieza": limpieza,
      "select": selectString,
      "opinion": opinion
    }

    this.db.addData('encuestasCliente', json);

    // request.estado = 'ENCUESTADO';
    request.encuestado = true;
    request.date_updated = new Date().getTime();
    this.pedidoService.setOne(request);
    // localStorage.removeItem('products');
    
    this.authSrv.toast('Encuesta realizada', 'success', 'Gracias por tu opinión');
    /* this.toastr.presentToast('Gracias por tu opinión!', 2000, 'success', 'Encuesta'); */
    // this.toastr.success('Muchas gracias por tu opinion!!', 'Encuesta enviada');
    // let audio = new Audio('./assets/sounds/noti.mp3');
    // audio.play();
    setTimeout(() => {
      this.yaEnvioEncuesta = true;
      this.router.navigate(["/home"]);
    }, 2000);
  }
}
