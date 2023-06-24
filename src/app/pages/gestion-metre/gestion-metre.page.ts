import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MesaService } from 'src/app/services/mesa.service';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
import { PedidoService } from 'src/app/services/pedido.service';
import { Mesa } from 'src/app/shared/mesa.interface';
import { Pedido } from 'src/app/shared/pedido.interface';
import { ListaEspera } from 'src/app/shared/listaEspera.interface';
import { ListaEsperaService } from 'src/app/services/lista-espera.service';

@Component({
  selector: 'app-gestion-metre',
  templateUrl: './gestion-metre.page.html',
  styleUrls: ['./gestion-metre.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class GestionMetrePage implements OnInit {

  waitSelected;
  wait: Array<any> = [];
  waits$: Observable<any>;
  tables$: Observable<any>;

  kyndSelected;
  kynds = [
    { val: 'Activos', img: 'assets/images/default.png' },
    { val: 'Inactivos', img: 'assets/images/default.png' },
  ];

  constructor(
    private router: Router,
    private vibration: Vibration,
    private tableService: MesaService,
    private waitService: ListaEsperaService,
    private pedidoService: PedidoService,
  ) { }

  ngOnInit() {
    this.wait = [];
    this.kyndSelected = this.kynds[0];
    /* this.waits$ = this.waitService.getActivos(); */
    this.getTables();
    this.getWaits(this.kyndSelected.val);
    this.getMesas();
  }

  getMesas() {

    this.waitService.getActive().subscribe((data) => {
      this.wait = [];
      data.forEach(element => {
        this.wait.push(element);
        console.log(this.wait)
      })
    });

  }
  setFilter(p) {
    this.kyndSelected = p;
    this.getWaits(p.val);
  }

  getTables() {
    this.tables$ = this.tableService.getByStatus('DISPONIBLE');
    console.log(this.tables$)
  }

  getWaits(filter: string) {
    switch (filter) {

      case 'Inactivos':
        this.waits$ = this.waitService.getInactivos();

        break;

      default:
        this.waits$ = this.waitService.getActivos();
        console.log(this.waits$);
        break;
    }
  }

  clickRequest(model: ListaEspera) {
    this.waitSelected = model;
  }

  clickConfirm(model: Mesa) {
    this.waitSelected.estado = 'EN USO';
    this.waitService.setOne(this.waitSelected);

    model.estado = 'RESERVADO';
    this.tableService.setOne(model, this.waitSelected.user_uid);

    let p: Pedido = this.createModelPedido(model);
    this.pedidoService.createOne(p);

    // let audio = new Audio('./assets/sounds/noti.mp3');
    // audio.play();
    // this.toastr.success('Datos guardados con éxito! mesa Nº ' + model.numero + ' se encuentra en uso', 'Aceptación de Pedido');
    this.vibration.vibrate([500]);
    this.waitSelected = null;
  }

  clickCancel(model: ListaEspera) {
    model.estado = 'CANCELADO';
    this.waitService.setOne(model);

    const a = this.pedidoService.getLastByUser(model.correo).subscribe((data: Pedido) => {
      if (data) {
        data.date_updated = new Date().getTime();
        data.estado = 'CANCELADO';

        const b = this.tableService.getByNumber(data.mesa_numero).subscribe((mesa: Mesa) => {
          mesa.estado = 'DISPONIBLE';
          this.tableService.setOne(mesa, '');
          b.unsubscribe();
        });

        this.pedidoService.setOne(data);
        a.unsubscribe();
      }
    });

    // let audio = new Audio('./assets/sounds/noti.mp3');
    // audio.play();
    // this.toastr.success('Datos guardados con éxito!', 'Cancelación de Pedido');
    this.vibration.vibrate([500]);
    this.waitSelected = null;
  }

  clickBack() {
    this.waitSelected = null;
  }

  redirectTo(path: string) {
    this.router.navigate([path]);
  }

  private createModelPedido(mesa: Mesa) {
    let m: Pedido = {
      id: '',
      correo: this.waitSelected.correo,
      mesa_numero: mesa.numero,
      producto_id: [],
      date_created: new Date().getTime(),
      date_updated: new Date().getTime(),
      estado: 'PENDIENTE',
      encuestado: false,
      descuento10: 'NO JUGO',
      descuento15: 'NO JUGO',
      descuento20: 'NO JUGO'
    }
    return m;
  }
}
