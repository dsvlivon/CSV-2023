import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MailService } from 'src/app/services/mail.service';
import { User2 } from '../../shared/user2.interface';
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

  constructor(
    private fb: FormBuilder,
    private mailService: MailService,
    ) { 
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
  pruebaMail(){
    const user: User2 = {
      uid: '123456789',
      nombre: 'Ignacio',
      apellido: 'Sanabria',
      dni: 12345678,
      img: 'ruta/a/imagen.png',
      correo: 'nachoutnfra@gmail.com',
      fechaCreacion: Date.now(),
      estado: 'PENDIENTE',
      perfil: 'CLIENTE',
      rol: 'COCINERO',
      cuil: 1234567890
    };
    this.mailService.notificationStatus(user);
  }
}
