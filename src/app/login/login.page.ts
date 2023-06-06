import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LoginPage implements OnInit {

  authSrv = inject(AuthService);

  formData: FormGroup;
  error: boolean = false;
  message: string = '';

  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit() {
    this.formData = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onLogin() {
    const form = this.formData.value;
    const user = await this.authSrv.signIn(form.email, form.password).then(resp => {
      console.log(resp);
      this.router.navigate(['/home']);
      return user;
    }).catch(err => {
      console.log(err);

      this.error = true;
      this.message = "El usuario no existe";
      setTimeout(() => {
        this.message = '';
        this.error = false;
      }, 2000);
    });
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
   /*  const form = this.formData.value;
    const user = await this.authSrv.signIn(form.email, form.password).then(resp => {
      this.router.navigate(['/home']);
    }); */
  }
  get email() {
    return this.formData.get('email');
  }
  get password() {
    return this.formData.get('password');
  }

}
