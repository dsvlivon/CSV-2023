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

  result: string;
  pointsUser = 0;
  pointsComp = 0;
  turnos = 0;

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

  play(choice: string): void {
    const result = this.playGame.game(choice);
    console.log(result);
    this.result = result.message;
    this.pointsUser += result.userAdd;
    this.pointsComp += result.compAdd;
  }

  private getComputerChoice(): string {
    const choices = ['r', 'p', 's']; // Roca, Pape, Tijeras
    const randomChoice = Math.floor(Math.random() * 3);
    return choices[randomChoice];
  }

  navigateBack() {
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }


  game(
    userChoice: string
  ): {
    message: string;
    userAdd: number;
    compAdd: number;
  } {
    const playUserComp = userChoice + this.getComputerChoice();
    console.log(`Jugada realizada: ${playUserComp}`);
    let playStatus: {
      message: string;
      userAdd: number;
      compAdd: number;
    };
    if (this.pointsComp < 2 || this.pointsUser < 2) {
      switch (playUserComp) {
        // Ganamos
        case 'rs':
        case 'sp':
        case 'pr':
          playStatus = {
            message: 'Ganas a la computadora',
            userAdd: 1,
            compAdd: 0,
          };
          this.turnos += 1;
          break;
        // Gana la computadora
        case 'rp':
        case 'ps':
        case 'sr':
          playStatus = {
            message: 'Gana la computadora',
            userAdd: 0,
            compAdd: 1,
          };
          this.turnos += 1;
          break;
        // Empatamos
        case 'rr':
        case 'pp':
        case 'ss':
          playStatus = {
            message: 'Habéis elegido la misma jugada y habéis empatado',
            userAdd: 0,
            compAdd: 0,
          };
          break;
      }
    }
    return playStatus;
  }

}