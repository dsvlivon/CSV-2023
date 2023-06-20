import {Component, OnInit, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Mesa } from 'src/app/shared/mesa.interface';
import { Pedido } from 'src/app/shared/pedido.interface';
import { Producto } from 'src/app/shared/producto.interface';
import { ListaEspera } from 'src/app/shared/listaEspera.interface';
import { MesaService } from 'src/app/services/mesa.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { PushnotificationService } from 'src/app/services/pushnotification.service';
import { ListaEsperaService } from 'src/app/services/lista-espera.service';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-pedidos',
  templateUrl: './lista-pedidos.page.html',
  styleUrls: ['./lista-pedidos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ListaPedidosPage implements OnInit {

  public user;
  requests$: Observable<any>;

  tables: any;
  waits: any;

  kyndSelected;
  kynds = [
    { val: 'Activos' }
  ];

  constructor(private authService: AuthService,
              private router: Router,
              private pnService: PushnotificationService,
              private pedidoService: PedidoService,
              private mesaService: MesaService,
              private listaService: ListaEsperaService) { }

  ngOnInit() {
    //PARA LEVANTAR USUARIO TIPO MOZO-BARTENDER-COCINERO
    this.authService.user$.subscribe(data => {
      this.user = data
    });
    let ls = localStorage.getItem('user');
    if (ls != null) {
      let user = JSON.parse(ls);
      this.user = user;
      console.log(user.rol);
    }
    this.kyndSelected = this.kynds[0];
    this.getRequests(this.kyndSelected.val);

  }

  getRequests(filter: string) {
    switch (filter) {
      case 'Activos':
        this.requests$ = this.pedidoService.getActivos();
        break;

      default:
        this.requests$ = this.pedidoService.getAll();
        break;
    }
  }

  private getAllTables() {
    this.mesaService.getAll().subscribe(data => {
      this.tables = data;
    })
  }

  private getAllWaits() {
    this.listaService.getAll().subscribe(data => {
      this.waits = data;
    })
  }

  clickDetails(model: Producto) {
    //aqui iria para mostrar los productos
  }

  setStatus(model: Pedido, status: any) {
    model.estado = status;
    model.date_updated = new Date().getTime();
    try {
      this.pedidoService.updateOne(model);
      switch(model.estado)
      {
        case 'ACEPTADO':
          this.pnService.enviarNotificacionUsuarios('COCINERO', 'Pedido', 'Un pedido fue aceptado, se solicita preparacion', true);
          this.pnService.enviarNotificacionUsuarios('BARTENDER', 'Pedido', 'Un pedido fue aceptado, se solicita preparacion', true);
          break;
        case 'COCINADO':
          this.pnService.enviarNotificacionUsuarios('MOZO', 'Pedido', 'Un pedido está listo para entregarse', true);
          break;
      }

      if (model.estado == 'COBRADO') {

        this.waits.reverse().forEach(t => {
          if (t.correo == model.correo) {
            this.setStatusWait(t);
          }
        });

        this.tables.forEach(t => {
          if (t.numero == model.mesa_numero) {
            this.setStatusTable(t);

            // let audio = new Audio('./assets/sounds/noti.mp3');
            // audio.play();
            this.toast('Mesa disponible','success','Se ha liberado la mesa '+t.numero);
            // this.toastr.success('Datos registrados, ahora la mesa Nº ' + t.numero + ' está Disponible', 'Estado de Pedido');
          }
        });
      }
    }
    catch (error) {
      this.toast('Error','danger','Ocurrio un error al actualizar el estado!');
      // this.toastr.error('Error inesperado al momento de cambiar estado del pedido', 'Acción')
    }
  }

  setStatusTable(mesa: Mesa){
    mesa.estado = 'DISPONIBLE';
    this.mesaService.updateOne(mesa);
  }

  setStatusWait(waitList: ListaEspera){
    waitList.estado = 'FINALIZADO';
    this.listaService.updateOne(waitList);
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
    });
  }

  getTotal(pedido:any){
    let a = 0;
    let b = 0;
    pedido.producto_id.forEach(p => {
      a += p.precio
    });
    if (pedido.descuento10 == 'GANO') {
      b += (a * 0.1);
    }

    if (pedido.descuento15 == 'GANO') {
      b += (a * 0.15);
    }

    if (pedido.descuento20 == 'GANO') {
      b += (a * 0.2);
    }
    return a-b;
  }

  navigateBack(){
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }



}
