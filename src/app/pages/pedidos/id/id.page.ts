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

@Component({
  selector: 'app-id',
  templateUrl: './id.page.html',
  styleUrls: ['./id.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class IdPage implements OnInit {
  
  pedido$: Observable<any>;
  table$: Observable<any>
  pedirCuenta:boolean = false;
  propina:number = 0;
  productsSelected: any[];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private pedidoService: PedidoService,
              private pnService: PushnotificationService) { }

  ngOnInit() {
    this.getPedido();
    this.checkProductsSelected();
  }

  private checkProductsSelected() {
    let a = JSON.parse(localStorage.getItem('products'));
    console.log(a);
    if (a !== null) { this.productsSelected = a; } else {
      console.log("entro aca");
      const id = this.route.snapshot.paramMap.get('id');
      let b = this.pedidoService.getById(id).subscribe((datos)=>{
        //console.log(datos);
         this.productsSelected = datos['producto_id'];
         alert(this.productsSelected);
        // b.unsubscribe();
      });
    }
  }
  getPedido() {
    const id = this.route.snapshot.paramMap.get('id');
    this.pedido$ = this.pedidoService.getById(id);
  }

  getProductsSelected() {
    return JSON.parse(localStorage.getItem('products'));
  }

  getTitle(status: string) {
    switch (status) {
      case 'PENDIENTE':
        return 'Confirmar Pedido';

      case 'ACEPTADO':
        return 'Confirmar Recepción a su Mesa';

      case 'CONFIRMADO':
        return 'Pedir Cuenta para Pagar';

      case 'COBRAR':
        return 'Confirmar Pago Efectuado';

      case 'COBRAR':
        return 'Realizar Encuesta';

      case 'PREPARACION':
        return 'Pedido en Preparación';
      case 'COBRADO':
        return 'Recomendación del Cliente';

      default:
        return '';
    }
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
    pedido.producto_id = this.getProductsSelected();
    this.pedidoService.updateOne(pedido).then(()=>{
      this.pnService.enviarNotificacionUsuarios('MOZO', 'Pedido', 'Un cliente realizó un pedido', true);
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
    
  }

  getAcum(pedido?: Pedido) {
    let a = 0;
    this.productsSelected.forEach(p => { a += (p.quantity * p.precio); });
    return a;
  }

  clickEditarProductos(){
     this.router.navigate(['/menu-productos']);
  }

  getDescontado(pedido:Pedido){
    let a = 0;
    let b=0;
    this.getProductsSelected().forEach(p => { a += (p.quantity * p.precio) });
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

}
