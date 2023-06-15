import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MailService } from 'src/app/services/mail.service';
import { User2 } from 'src/app/shared/user2.interface';
import { SpinnerComponent } from 'src/app/spinner/spinner.component';
import { Observable } from 'rxjs';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.page.html',
  styleUrls: ['./lista-usuarios.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ListaUsuariosPage implements OnInit {
  users$: Observable<any>;

  profiles = [
    { val: 'Clientes' },
  ]

  status = [
    { val: 'ACEPTADO' },
    { val: 'PENDIENTE' },
    { val: 'RECHAZADO' }
  ]

  profileSelected: any;

  constructor(private firestoreService: FirestoreService, private router: Router, private mailService: MailService) { }

  ngOnInit() {
    this.profileSelected = this.profiles[0];
    this.getUsers(this.profileSelected.val);
  }

  getUsers(filter: string) {
    switch (filter) {

      case 'Clientes':
        this.users$ = this.firestoreService.getClientes();
        break;
    }
  }

  navigateBack(){
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }

  setStatus($event, user: User2){
      user.estado = $event.target.value;
      this.firestoreService.updateEstadoUsuario(user);
      this.mailService.notificationStatus(user);
  }

}
