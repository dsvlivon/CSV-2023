import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { QrscannerService } from 'src/app/services/qrscanner.service';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { PedidoService } from 'src/app/services/pedido.service';
import { Pedido } from 'src/app/shared/pedido.interface';
import { PushnotificationService } from 'src/app/services/pushnotification.service';
import Swal from 'sweetalert2';
import {SpinnerComponent} from '../../../spinner/spinner.component';

@Component({
  selector: 'app-id',
  templateUrl: './id.page.html',
  styleUrls: ['./id.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, SpinnerComponent]
})
export class IdPage implements OnInit {
   
  pedido$: Observable<any>;
  table$: Observable<any>
  pedirCuenta:boolean = false;
  propina:number = 0;
  productsSelected: any;
  tituloEstado: string;
  auxTitulo: string; 
  spinner: boolean = false;
  //Para SCANNER
  scanActive = false;
  constructor(private router: Router,
              private route: ActivatedRoute,
              private pedidoService: PedidoService,
              private pnService: PushnotificationService,
              private qrScannerService: QrscannerService) { }

  ngOnInit() {
    this.spinner = false;
    this.getPedido();
    this.checkProductsSelected();
    this.getTitle();
  }

  private checkProductsSelected() {
    //let a = JSON.parse(localStorage.getItem('products'));
    //console.log(a);
    //if (a !== null) { this.productsSelected = a; } else {
    //}
    //console.log("entro aca");
    const id = this.route.snapshot.paramMap.get('id');
    let b = this.pedidoService.getById(id).subscribe((datos)=>{
            this.productsSelected = datos['producto_id'];
            b.unsubscribe();
      });
  }
  getPedido() {
    const id = this.route.snapshot.paramMap.get('id');
    this.pedido$ = this.pedidoService.getById(id);
  }

  getProductsSelected() {
    //return JSON.parse(localStorage.getItem('products'));
  }

  getTitle() {
    const id = this.route.snapshot.paramMap.get('id');
      let b = this.pedidoService.getById(id).subscribe((datos)=>{
        console.log(datos);
        this.auxTitulo = datos['estado'];
        console.log(this.auxTitulo);
        switch (this.auxTitulo) {
          case 'PENDIENTE':
            //return 'Confirmar Pedido';
           this.tituloEstado = 'Confirmar Pedido';
           break;
          case 'ACEPTADO': 
            //return 'Confirmar Recepción a su Mesa';
           this.tituloEstado = 'Confirmar Recepción a su Mesa';
           break;
          case 'CONFIRMADO':
            //return 'Pedir Cuenta para Pagar';
           this.tituloEstado = 'Pedir Cuenta para Pagar';
           break;
          case 'COBRAR':
           // return 'Confirmar Pago Efectuado';
           this.tituloEstado = 'Confirmar Pago Efectuado';
           break;
          case 'COBRAR':
            //return 'Realizar Encuesta';
           this.tituloEstado = 'Realizar Encuesta';
           break;
          case 'PREPARACION':
            //return 'Pedido en Preparación';
            this.tituloEstado = 'Pedido en Preparación';
            break;
          case 'COCINADO':
            this.tituloEstado = 'Pedido ya cocinado';
            break;
          case 'COBRADO':
            //return 'Recomendación del Cliente';
            this.tituloEstado = 'Recomendación del Cliente';
            break;
          default:
            //return '';
            this.tituloEstado = '';
        }
        b.unsubscribe();
      });
  }

  getAproxFinish() {
    let minutos: number = 0;
    this.productsSelected.forEach(p => { 
      //minutos += p.tiempo; 
      if(minutos < p.tiempo){
        minutos = p.tiempo;
      }
    });
    return minutos;
  }

  //Cliente envia su pedido al mozo para que lo preparen
  clickPendiente(pedido: Pedido) {
    this.spinner = true;
    pedido.producto_id = this.productsSelected;
    this.pedidoService.updateOne(pedido).then(()=>{
      this.pnService.enviarNotificacionUsuarios('MOZO', 'Pedido', 'Un cliente realizó un pedido', true);
      this.spinner = false;
      this.toast("Su pedido fue registrado con exito","success").then(()=>{
        this.router.navigate(['/home']);
      })
    }).catch((err)=>{
      console.log(err);
    });
  }

  //Cliente confirma que recibio su pedido
  clickRecibido(pedido: Pedido) {
    pedido.estado = 'CONFIRMADO';
    this.pedidoService.updateOne(pedido).then(()=>{
      this.pnService.enviarNotificacionUsuarios('MOZO', 'Pedido', 'Un cliente confirmo la recepcion de un pedido', true);
      this.toast('Gracias por confirmar recepción!',"success").then(()=>{
        this.router.navigate(['/home']);
      })
    }).catch((err)=>{
      console.log(err);
    });
  }

  //Cliente pide la cuenta
  clickCobrar(pedido: Pedido){
    pedido.estado = 'COBRAR';
    this.pedidoService.updateOne(pedido).then(()=>{
      this.pnService.enviarNotificacionUsuarios('MOZO', 'Pedido', 'Un cliente pidió la cuenta', true);
      this.toast('Gracias por informar, en breves se le acercará un mozo!',"success").then(()=>{
        this.router.navigate(['/home']);
      })
    }).catch((err)=>{
      console.log(err);
    });
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

  clickPedirCuenta()
  {
    this.pedirCuenta = true;
  }

  clickCancelarCuenta()
  {
    this.pedirCuenta = false;
  }

  //ACA SE ESCANEAN LOS QR DE LAS PROPINAS
  agregarPropina(){
    this.scanActive = true;
    this.qrScannerService.startScan().then((result) => {
      switch(result){
        case 'MALO':
          this.propina = 0;
            break;
        case 'REGULAR':
          this.propina = this.getAcum() * 0.05;
            break;
        case 'BUENO':
          this.propina = this.getAcum() * 0.1;
            break;
        case 'MUY BUENO':
          this.propina = this.getAcum() * 0.15;
            break;
        case 'EXCELENTE':
          this.propina = this.getAcum() * 0.2;
            break;
      }
      this.scanActive = false;
    });
  }

  stopScan(){
    this.scanActive = false;
    this.qrScannerService.stopScanner();
  }

  getAcum(pedido?: Pedido) {
    let a = 0;
    this.productsSelected?.forEach(p => { a += (p.quantity * p.precio); });
    return a;
  }

  clickEditarProductos(){
     this.router.navigate(['/menu-productos']);
  }

  getDescontado(pedido:Pedido){
    let a = 0;
    let b=0;
    this.productsSelected.forEach(p => { a += (p.quantity * p.precio) });
    if(pedido && pedido.descuento10 == 'GANO'){
      b += (a * 0.1);
    }

    if(pedido && pedido.descuento15 == 'GANO'){
      b += (a * 0.15);
    }

    if(pedido && pedido.descuento20 == 'GANO'){
      b += (a * 0.2);
    }
    return b;
  }

  clickJuego10(pedido: Pedido) {
    //Aqui va a ir el descuento del 10%
  }

  clickJuego15(pedido: Pedido) {
    //Aqui va a ir el descuento del 15%
  }

  clickJuego20(pedido: Pedido) {
    //Aqui va a ir el descuento del 20%
  }

  navigateBack(){
    this.router.navigate(['/home']);
  }

}
