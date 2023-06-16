import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';
import { Router } from '@angular/router';
import { AnimationController } from '@ionic/angular';
import { PushnotificationService } from '../services/pushnotification.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import Swal from 'sweetalert2';
import { MailService } from '../services/mail.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, SpinnerComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LoginPage implements OnInit {
  spinner: boolean = false;
  authSrv = inject(AuthService);
  user = null;
  formData: FormGroup;
  error: boolean = false;
  message: string = '';

  constructor(private fb: FormBuilder,
    private router: Router,
    private animationCtrl: AnimationController,
    private firestoreService: FirestoreService,
    private pnService: PushnotificationService,
    private mailService: MailService) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'))
    console.log(this.user);
    this.formData = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.formData.reset();
  }

  async onLogin() {
    const form = this.formData.value;
    this.spinner = true;

    const user = await this.authSrv.signIn(form.email, form.password).then(resp => {
      const sub = this.firestoreService.getByMail(resp.user.email).subscribe((data) => {
        console.log('entro en data ');
        console.log(data);
        if (data[0]['estado'] === 'ACEPTADO') {
          sub.unsubscribe();
          this.toast('Ingreso exitoso', 'success');
          this.pnService.getUser(data[0]);

          this.router.navigateByUrl('home', { replaceUrl: true }).then(() => {
            this.spinner = false;
          })

        } else if (data[0]['estado'] === 'PENDIENTE') {
          this.mailService.notificationStatus(data[0]);
          this.toast('Error en el ingreso', 'info', 'Tu solicitud de registro aún no fue aceptada')
          localStorage.removeItem('user');
          this.spinner = false;
          sub.unsubscribe();
        } else if (data[0]['estado'] === 'RECHAZADO') {

          this.mailService.notificationStatus(data[0]);
          this.toast('Error en el ingreso', 'error', 'Tu solicitud de registro fue rechazada')
          this.spinner = false;
          localStorage.removeItem('user');
          sub.unsubscribe();

        } else {
          this.toast('Error en el ingreso', 'error')
          this.spinner = false;
          localStorage.removeItem('user');
          sub.unsubscribe();
        }

      });


    }).catch(err => {
      console.log(err);
      this.toast('Error en el ingreso', 'error', 'El usuario no existe')
      this.formData.reset();
      localStorage.removeItem('user');

      this.error = true;
      setTimeout(() => {
        this.spinner = false;
        this.error = false;
      }, 2000);
    });
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
  async accesoRapido(set: any) {
    if (set == 'duenio') {
      this.formData.setValue({ email: "duenio@duenio.com", password: "111111" });
    } else if (set == 'cliente') {
      this.formData.setValue({ email: "cliente@cliente.com", password: "222222" });
    } else if (set == 'metre') {
      this.formData.setValue({ email: "metre@metre.com", password: "333333" });
    } else if (set == 'mozo') {
      this.formData.setValue({ email: "mozo@mozo.com", password: "444444" });
    } else if (set == 'cocinero') {
      this.formData.setValue({ email: "cocinero@cocinero.com", password: "555555" });
    } else if (set == 'bartender') {
      this.formData.setValue({ email: "bartender@bartender.com", password: "666666" });
    } else if (set == 'supervisor') {
      this.formData.setValue({ email: "supervisor@supervisor.com", password: "777777" });
    }

  }
  get email() {
    return this.formData.get('email');
  }
  get password() {
    return this.formData.get('password');
  }
  seleccionarTipo(tipo: string) {
    this.spinner = true;
    setTimeout(() => {
      this.authSrv.tipo = tipo;
      this.router.navigateByUrl('alta-cliente', { replaceUrl: true });

    }, 4000);

  }

  //ANIMACIONES MODAL
  enterAnimation = (baseEl: HTMLElement) => {
    const root = baseEl.shadowRoot;

    const backdropAnimation = this.animationCtrl
      .create()
      .addElement(root.querySelector('ion-backdrop')!)
      .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

    const wrapperAnimation = this.animationCtrl
      .create()
      .addElement(root.querySelector('.modal-wrapper')!)
      .keyframes([
        { offset: 0, opacity: '0', transform: 'scale(0)' },
        { offset: 1, opacity: '0.99', transform: 'scale(1)' },
      ]);

    return this.animationCtrl
      .create()
      .addElement(baseEl)
      .easing('ease-out')
      .duration(500)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  leaveAnimation = (baseEl: HTMLElement) => {
    return this.enterAnimation(baseEl).direction('reverse');
  };
}
