import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { FirestoreService } from '../../services/firestore.service';
import { BarraComponent } from 'src/app/barra/barra.component';

@Component({
  selector: 'app-juegos',
  templateUrl: './juegos.page.html',
  styleUrls: ['./juegos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, BarraComponent]
})
export class JuegosPage implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    private firestoreService: FirestoreService,
  ) { }

  ngOnInit() {
  }

}
