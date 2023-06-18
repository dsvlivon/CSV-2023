import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class JuegoService {
  constructor() {}
  
  private getComputerChoice(): string {
    const choices = ['r', 'p', 's']; // Roca, Pape, Tijeras
    const randomChoice = Math.floor(Math.random() * 3);
    return choices[randomChoice];
  }

  game(
    userChoice: string
  ): {
    turnos: number;
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
      turnos: number;
    };
    
    switch (playUserComp) {
      // Ganamos
      case 'rs':
      case 'sp':
      case 'pr':
        playStatus = {
          message: 'Ganas a la computadora',
          userAdd: 1,
          compAdd: 0,
          turnos: 1
        };
        break;
      // Gana la computadora
      case 'rp':
      case 'ps':
      case 'sr':
        playStatus = {
          message: 'Gana la computadora',
          userAdd: 0,
          compAdd: 1,
          turnos: 1
        };
        break;
      // Empatamos
      case 'rr':
      case 'pp':
      case 'ss':
        playStatus = {
          message: 'Habéis elegido la misma jugada y habéis empatado',
          userAdd: 0,
          compAdd: 0,
          turnos: 0
        };
        break;
    }
    return playStatus;
  }
}