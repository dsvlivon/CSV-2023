import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-barra',
  templateUrl: './barra.component.html',
  styleUrls: ['./barra.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})

export class BarraComponent  implements OnInit {

  constructor(
    
    private authService: AuthService, 
    private router: Router
) {}

ngOnInit() {}

goAltas(){ this.router.navigate(['/altas']); }

goEncuestas(){ this.router.navigate(['/encuestas']); } 

goGestion(){ this.router.navigate(['/gestion']); }

goDelivery(){ this.router.navigate(['/delivery']); }

goJuegos(){ this.router.navigate(['/juegos']); }

goQr(){ this.router.navigate(['/app-lector-qr']); }

logOut() { this.authService.signOut(); }



}

