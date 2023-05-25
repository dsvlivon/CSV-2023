import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';
import { BarraComponent } from 'src/app/barra/barra.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, BarraComponent]
})
export class HomePage implements OnInit {
  user: any = null;
  salary: number;
  percentage: number;
  flag: boolean = false;
  loading: any;
  activeMonth: boolean=false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private firestoreService: FirestoreService,
  ) { }

  ngOnInit() { }

  
}



