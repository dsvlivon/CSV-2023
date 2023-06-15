import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MailService } from 'src/app/services/mail.service';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { User2 } from 'src/app/shared/user2.interface';
import { Router } from '@angular/router';
import { CamaraService } from 'src/app/services/camara.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { getStorage, ref, uploadString } from '@angular/fire/storage';
import { FirestorageService } from 'src/app/services/firestorage.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { QrscannerService } from 'src/app/services/qrscanner.service';
import { BarraComponent } from 'src/app/barra/barra.component';
import { SpinnerComponent } from 'src/app/spinner/spinner.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-alta-supervisor',
  templateUrl: './alta-supervisor.page.html',
  styleUrls: ['./alta-supervisor.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, BarraComponent, SpinnerComponent]
})
export class AltaSupervisorPage implements OnInit {
  authSrv = inject(AuthService);
  currentScan: string[];

  dataUrl = '../../../assets/images/clientes/usuario.png';
  formData: FormGroup;
  spinner = false;
  scanActive: boolean = false;
  textoSwitch: string;
  valorSwitch: boolean;


  constructor(private fb: FormBuilder,
    private firestore: FirestoreService,
    private firestorage: AngularFireStorage,
    private router: Router,
    private camera: CamaraService,
    private qrScanner: QrscannerService,
    private emailSrv: MailService) {
  }

  ngOnInit() {
    this.valorSwitch = true;
    this.textoSwitch = "Dueño";
    this.formData = this.fb.group({
      'correo': ['', [Validators.required, Validators.email]],
      'password': ['', Validators.required],
      'nombre': ['', Validators.required],
      'apellido': ['', Validators.required],
      'dni': ['', [Validators.required, Validators.min(1000000), Validators.max(99999999)]],
      'cuil': ['', [Validators.required]],
      'confirmPassword': ['', Validators.required],
      'perfil': ['', [Validators.required]],
    });
  }

  async SacarFoto() {
    const form = this.formData.value;
    let foto = {
      img: ''
    }
    const photo = await this.camera.addNewToGallery(foto);
    this.dataUrl = photo;

    const fileStorage = getStorage();
    const date = Date.now();

    const name = `${form.nombre}/${date}`;
    const storageRef = ref(fileStorage, name);
    const url = this.firestorage.ref(name);

    uploadString(storageRef, this.dataUrl, 'data_url').then(() => {
      url.getDownloadURL().subscribe((url1) => {
        this.dataUrl = url1;
      })
    })
  }

  async Registro() {
    this.spinner = true;
    const form = this.formData.value;
    let perfil: any = '';
    if (this.textoSwitch === 'Supervisor') {
      perfil = 'SUPERVISOR'
    }
    else {
      perfil = 'DUENIO';
    }

    if (form.password === form.confirmPassword) {
      if (this.dataUrl !== '../../../assets/images/clientes/usuario.png') {

        const user = await this.authSrv.registerUser(form.correo, form.password).then((resp) => {
          let datos: User2 = {
            nombre: form.nombre,
            apellido: form.apellido,
            dni: form.dni,
            img: this.dataUrl,
            correo: form.correo,
            password: form.password,
            perfil: perfil,
            fechaCreacion: new Date().getTime(),
            estado: 'ACEPTADO',
            uid: resp.user.uid
          }
          this.toast(`${perfil} creado correctamente`, 'success');
          this.spinner = false;
          this.firestore.addUser(datos, resp.user.uid);
          this.emailSrv.notificationInabled(datos);
        }).catch(err => {
          this.manejoErrores(err.code);
        });
      } else {
        this.toast('Debes cargar tu foto', 'info');
      }
    } else {
      this.toast('Las contraseñas deben coincidir', 'info');
    }
  }

  manejoErrores(err: string) {
    switch (err) {
      case 'auth/email-already-in-use':
        this.toast('El usuario ya existe', 'error')
        break;
      case 'auth/invalid-email':
        this.toast('El email ingresado no es correcto', 'error')

        break;
      case 'auth/user-not-found':
        this.toast('No existe registro con ese usuario', 'error')

        break;
      default:
        this.toast('Error al Registrarse', 'error')
        break;
    }
  }

  async toast(title: string, icono: any, text?: string) {
    await Swal.fire({
      title: title,
      text: text,
      icon: icono,
      timer: 3000,
      toast: true,
      position: 'top',
      grow: 'row',
      showConfirmButton: false,
      timerProgressBar: true
    })
    this.spinner = false;
  }

  cambiarPerfil(event: any) {
    //console.log(event.detail.checked);
    if (!event.detail.checked) {
      this.textoSwitch = "Supervisor"
    }
    else {
      this.textoSwitch = "Dueño"
    }
  }

  escanearQR() {
    this.scanActive = true;
    this.qrScanner.startScan().then((result) => {
      this.currentScan = result.split('@');
      console.log(this.currentScan);

      this.formData.patchValue({
        apellido:
          this.currentScan[1].charAt(0) +
          this.currentScan[1].slice(1).toLocaleLowerCase(),
        nombre:
          this.currentScan[2].split(' ')[0].charAt(0) +
          this.currentScan[2].split(' ')[0].slice(1).toLocaleLowerCase() +
          ' ' +
          this.currentScan[2].split(' ')[1].charAt(0) +
          this.currentScan[2].split(' ')[1].slice(1).toLocaleLowerCase(),
        dni: this.currentScan[4],
        correo: this.formData.getRawValue().correo,
        clave1: this.formData.getRawValue().password,
        clave2: this.formData.getRawValue().confirmPassword,
      });
      this.scanActive = false;

    })
  }

  stopScan() {
    this.scanActive = false;
    this.qrScanner.stopScanner();
  }

}
