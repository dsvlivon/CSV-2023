import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BarraComponent } from 'src/app/barra/barra.component';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-gastos',
  templateUrl: './gastos.page.html',
  styleUrls: ['./gastos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, BarraComponent]
})
export class GastosPage implements OnInit {
  user: any = null;

  currentControl: any;
  food: number;
  medicine: number;
  services: number;
  taxes: number;

  activeMonth: boolean = false;
  currentMonth: string;
  currentYear: any;

  loading: any;

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private router: Router,
    private loadingController: LoadingController
  ) { }

  async ngOnInit() {
    await this.showLoading('Cargando...');
    this.authService.user$.subscribe(async (user: any) => {
      this.loading.dismiss();
      await this.showLoading('Cargando...');
      if (user) {
        this.user = user;
        this.firestoreService
          .getMonthlyControls(this.user.uid)
          .subscribe((controls) => {
            const currentDate = new Date();
            this.currentMonth = this.getMonth(currentDate);
            this.currentYear = currentDate.getFullYear();
            this.activeMonth = false;
            
            console.log("xxx viendo control: "+controls.values)

            controls.forEach((control) => {
              if (
                control.month == this.currentMonth &&
                control.year == this.currentYear
              ) {
                this.activeMonth = true;
                this.currentControl = control;
                
              }
            });
            this.loading.dismiss();
          });
      } else {
        this.loading.dismiss();
      }
    });
    console.log("current control: "+this.currentControl);
  }

  getMonth(date: Date) {
    const months = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];
    return months[date.getMonth()];
  }

  addFood() {
    if (this.food <= 0 || this.food == undefined) {
      this.authService.toast('El importe debe ser mayor a 0', 'warning');
    } else {
      console.log("viendo el control: "+this.currentControl);
      console.log("add control food: "+this.currentControl.categories);
      this.currentControl.categories.food += this.food;
      this.showLoading('');
      this.firestoreService.updateControl(this.currentControl).then(() => {
        this.loading.dismiss();
        this.food = 0;
        this.authService.toast('Cargado con exito!!', 'success');
      });
    }
  }

  addMedicine() {
    if (this.medicine <= 0 || this.medicine == undefined) {
      this.authService.toast('El importe debe ser mayor a 0', 'warning');
    } else {
      this.currentControl.categories.medicine += this.medicine;
      this.showLoading('');
      this.firestoreService.updateControl(this.currentControl).then(() => {
        this.loading.dismiss();
        this.medicine = 0;
        this.authService.toast('Cargado con exito!!', 'success');
      });
    }
  }

  addServices() {
    if (this.services <= 0 || this.services == undefined) {
      this.authService.toast('El importe debe ser mayor a 0', 'warning');
    } else {
      this.currentControl.categories.services += this.services;
      this.showLoading('');
      this.firestoreService.updateControl(this.currentControl).then(() => {
        this.loading.dismiss();
        this.services = 0;
        this.authService.toast('Cargado con exito!!', 'success');
      });
    }
  }

  addTaxes() {
    if (this.taxes <= 0 || this.taxes == undefined) {
      this.authService.toast('El importe debe ser mayor a 0', 'warning');
    } else {
      this.currentControl.categories.taxes += this.taxes;
      this.showLoading('');
      this.firestoreService.updateControl(this.currentControl).then(() => {
        this.loading.dismiss();
        this.taxes = 0;
        this.authService.toast('Cargado con exito!!', 'success');
      });
    }
  }

  async showLoading(message: string) {
    try {
      this.loading = await this.loadingController.create({
        message: message,
        spinner: 'crescent',
        showBackdrop: true,
      });
      this.loading.present();
    } catch (error) {
      console.log(error.message);
    }
  }

}
