import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { ConsultasService } from 'src/app/services/consultas.service';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AnyMxRecord } from 'dns';
import { FirestoreService } from 'src/app/services/firestore.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { User2 } from 'src/app/shared/user2.interface';
import { JuegoService } from 'src/app/services/juego.service';
import { SpinnerComponent } from '../../spinner/spinner.component';
import * as moment from 'moment';



@Component({
  selector: 'app-consultas',
  templateUrl: './consultas.page.html',
  styleUrls: ['./consultas.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ConsultasPage implements OnInit {
  user: any = null;
  newMessage: string = '';
  messageList: any = [];
  pressedButton: boolean = false;
  
  soundSendMessage: any = new Audio('../../assets/audios/sendMessage.mp3');

  constructor(
    private authService: AuthService,
    private router: Router,
    private chatService: ConsultasService
  ) {
    this.soundSendMessage.volume = 0.1;
  }

  ngOnInit() {
    this.authService.user$.subscribe((user: any) => {
      if (user) {
        this.user = user;
      }
    });
    this.chatService.getMessagesA().subscribe((messagesA) => {
      if (messagesA !== null) {
        this.messageList = messagesA;
        setTimeout(() => {
          this.scrollToTheLastElementByClassName();
        }, 100);
      }
    });
  }

  showChat() {
    this.newMessage = '';
    this.showSpinner(1);
    setTimeout(() => {
      this.scrollToTheLastElementByClassName();
    }, 2100);
  } // endo of showChat4A



  sendMessage() {
    if (this.newMessage.trim() == '') {
      this.authService.toast('Debes escribir un mensaje', 'warning');
      return;
    } else if (this.newMessage.trim().length > 50) {
      this.authService.toast(
        'El mensaje no puede tener más de 21 caracteres',
        'warning'
      );
      return;
    }
    const date = moment(new Date()).format('DD-MM-YYYY HH:mm:ss');
    const message = {
      user: this.user,
      text: this.newMessage,
      date: date,
    };
    this.chatService.createMessageA(message);
    this.newMessage = '';
    this.scrollToTheLastElementByClassName();
    this.soundSendMessage.play();
  } // end of sendMessageA

  showSpinner(chatOption: number) {
    this.pressedButton = true;
    setTimeout(() => {
      this.pressedButton = false;
    }, 2000);
  } // end of showSpinner

  navigateBack() {
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }

  scrollToTheLastElementByClassName() {
    const elements = document.getElementsByClassName('mensajes');
    const lastElement: any = elements[elements.length - 1];
    const toppos = lastElement.offsetTop;
    document.getElementById('contenedor-mensajes').scrollTop = toppos;
  } 
}

