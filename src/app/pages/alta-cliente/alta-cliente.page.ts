import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-alta-cliente',
  templateUrl: './alta-cliente.page.html',
  styleUrls: ['./alta-cliente.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class AltaClientePage implements OnInit {
  authSrv = inject(AuthService);
  
  dataUrl = '../../../assets/images/clientes/usuario.png'
  form: FormGroup;

  constructor() { 
    console.log(this.authSrv.tipo)
  }

  ngOnInit() {
  }

  Registro() {

  }

  SacarFoto() {

  }
}
