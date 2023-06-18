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
  user: any = null;
  mostrar: boolean = true;
  result: string;
  pointsUser = 0;
  pointsComp = 0;
  turnos = 0;
  resultado = "";
  
  msgTitulo="Vence a nuestro campeón para ganar beneficios!"
  msgRes = "Reglas: Se juega al mejor de 3 intentos. En caso de empate nadie suma"

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private playGame: JuegoService,
    private router: Router) {

  }

  ngOnInit(): void {
    this.result = 'Esperando jugada...';
    this.result = '';
    console.log(this.pointsUser);
    this.authService.user$.subscribe(data => {
      this.user = data
      console.log(this.user);
    });
    let ls = localStorage.getItem('user');
    if (ls != null) {

      let user = JSON.parse(ls);
      this.user = user;
    }
  }

  evaluar(){
    if (this.pointsComp == 2 || this.pointsUser == 2) {
      if(this.pointsComp>this.pointsUser){
        this.msgRes="LO SIENTO, ESTA VEZ NO HUBO SUERTE!!!"
      } else {
        this.msgRes="FELICITACIONES HAS GANADO!!!"
      }
      this.mostrar=false;
      this.msgTitulo="";
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

}