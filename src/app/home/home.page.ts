import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';
import { BarraComponent } from 'src/app/barra/barra.component';
import { SpinnerComponent } from '../spinner/spinner.component';
import { QrscannerService } from '../services/qrscanner.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, BarraComponent, SpinnerComponent]
})
export class HomePage implements OnInit {
  user: any = null;
  spinner: boolean = false;
  waitlist = false;
  grid = true;

  scanActive = false;
  currentScan:string[];

  constructor(
    private authService: AuthService,
    private router: Router,
    private firestoreService: FirestoreService,
    private qrSrv: QrscannerService
  ) { }

  ngOnInit() {
    this.authService.user$.subscribe(data => {
      this.user = data
    });
    let ls = localStorage.getItem('user');
    if (ls != null) {
      let user = JSON.parse(ls);
      this.user = user;
    }
    this.spinner = true;
  }

  escanearQR() {
    this.scanActive = true;
    this.qrSrv.startScan().then((result) => {
      console.log(result);
      if(result === 'ENTRADALOCAL') {
        this.scanActive = false;
        this.waitlist = true;
        this.grid = false
      }
      

    })
  }
  stopScan() {
    this.scanActive = false;
    this.qrSrv.stopScanner();
  }
}



