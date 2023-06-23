import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AnyMxRecord } from 'dns';
import { FirestoreService } from 'src/app/services/firestore.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { User2 } from 'src/app/shared/user2.interface';
import { JuegoService } from 'src/app/services/juego.service';
import { ListaEsperaService } from '../../services/lista-espera.service';
import { PedidoService } from '../../services/pedido.service';

import { SpinnerComponent } from '../../spinner/spinner.component';

@Component({
  selector: 'app-juegos',
  templateUrl: './juegos.page.html',
  styleUrls: ['./juegos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, SpinnerComponent]

})
export class JuegosPage implements OnInit {

  @Output() terminadoEvent = new EventEmitter<boolean>();

  spinner = false;
  user: User2 = null;
  mostrar: boolean = true;
  result: string;
  pointsUser = 0;
  pointsComp = 0;
  turnos = 0;
  resultado = "";
  vidas: number = 2;

  data: any = null;

  hasWait: any = null;
  hasRequest: any = null;

  
  msgTitulo="Vence a nuestro campeón para ganar beneficios!"
  msgRes = "Reglas: Se juega al mejor de 3 intentos. En caso de empate nadie suma"

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private playGame: JuegoService,
    private router: Router,
    private listSrv: ListaEsperaService,
    private pedidoSrv: PedidoService) {

  }

  ngOnInit(): void {
    this.result = 'Esperando jugada...';
    this.result = '';
    //nuevo auth
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

  evaluar() {
    if (this.pointsComp === 2 || this.pointsUser === 2) {
      if (this.pointsComp > this.pointsUser) {
        this.vidas--;
        if (this.vidas === 1) {
          this.msgTitulo = "TE QUEDA UN INTENTO, VAMOS!!!";
        } else if (this.vidas === 0) {
          this.msgTitulo = "LO SIENTO, ESTA VEZ NO HUBO SUERTE!!!";
          this.mostrar = false;
        }
      } else {
        if (this.vidas === 2) {
          this.msgTitulo = "FELICITACIONES HAS GANADO Y HAS GANADO UN PREMIO!!!";
          this.hasRequest.descuento10 = 'GANO';//asignar DTO
          this.pedidoSrv.updateOne(this.hasRequest)
        } else {
          this.msgTitulo = "FELICITACIONES HAS GANADO!!!";
        }
        this.mostrar = false;
      } 
      
      this.msgRes = "";
      this.pointsUser = 0;
      this.pointsComp = 0;
      this.turnos = 0;
    }
  }  

  play(choice: string): void {
    const result = this.playGame.game(choice);

    console.log(result);
    this.result = result.message;
    this.pointsUser += result.userAdd;
    this.pointsComp += result.compAdd;
    this.turnos += result.turnos;
    this.evaluar()
  }

  private getComputerChoice(): string {
    const choices = ['r', 'p', 's']; // Roca, Pape, Tijeras
    const randomChoice = Math.floor(Math.random() * 3);
    return choices[randomChoice];
  }

  navigateBack() {
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }

  getIconArray() {
    return Array(this.vidas).fill({ color: 'warning' });
  }
}