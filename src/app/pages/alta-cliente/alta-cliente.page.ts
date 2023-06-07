import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

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
  formData: FormGroup;

  constructor(private fb: FormBuilder) { 
    console.log(this.authSrv.tipo)
  }

  ngOnInit() {
    this.formData = this.fb.group({
      'email': ['', [Validators.required, Validators.email]],
      'password': ['', Validators.required],
      'nombre': ['', Validators.required],
      'apellido': ['', Validators.required],
      'dni': ['', [Validators.required, Validators.min(1000000), Validators.max(99999999)]],
      'cuil': ['', [Validators.required ]]
    });
  }

  Registro() {

  }

  SacarFoto() {

  }
}
