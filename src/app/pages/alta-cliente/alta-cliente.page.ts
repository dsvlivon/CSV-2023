import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { User2 } from 'src/app/shared/user2.interface';
import { Router } from '@angular/router';
import { CamaraService } from 'src/app/services/camara.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { getStorage, ref, uploadString } from '@angular/fire/storage';
import { FirestorageService } from 'src/app/services/firestorage.service';

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

  constructor(private fb: FormBuilder, private firestore: FirestoreService, private angularFirestorage: FirestorageService, private route: Router, private camera: CamaraService ) { 
    console.log(this.authSrv.tipo)
  }

  ngOnInit() {
    this.formData = this.fb.group({
      'correo': ['', [Validators.required, Validators.email]],
      'password': ['', Validators.required],
      'nombre': ['', Validators.required],
      'apellido': ['', Validators.required],
      'dni': ['', [Validators.required, Validators.min(1000000), Validators.max(99999999)]],
      'cuil': ['', [Validators.required ]],
      
    });
  }

  async Registro() {
    const form = this.formData.value;
    if(this.authSrv.tipo === 'anonimo') {
      const email = form.nombre + '@anonymous.com';
      const password = '123456'
      let datos: User2 = {
        nombre: form.nombre,
        img: this.dataUrl,
        perfil: 'ANONIMO',
      }
      
      const user = await this.authSrv.registerUser(email, password).then((resp) => {
        console.log('esto es respuesta auth', resp);
        this.firestore.addUser(datos, resp.user.uid)
        this.route.navigate(['/home']);
      }).catch(err => {
        console.log(err);
      })
    } else {
      let datos: User2 = {
        nombre: form.nombre,
        apellido: form.apellido,
        dni: form.dni,
        img: this.dataUrl,
        correo: form.email,
        password: form.password,
        perfil: 'CLIENTE',
        fechaCreacion: new Date().getDate(),
        estado: 'PENDIENTE'
      }
      const user = await this.authSrv.registerUser(form.correo, form.password).then((resp) => {
        console.log('esto es respuesta auth', resp);
        this.firestore.addUser(datos, resp.user.uid)
        this.route.navigate(['/home']);
      }).catch(err => {
        console.log(err);
      })
    }
  }

  async SacarFoto() {

    const photo = await this.camera.addNewToGallery(this.dataUrl);

    this.dataUrl = photo;
        
  }
}
