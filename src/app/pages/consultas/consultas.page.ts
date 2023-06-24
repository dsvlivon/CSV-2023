import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { ConsultasService } from 'src/app/services/consultas.service';
import { AuthService } from '../../services/auth.service';
import * as moment from 'moment';
import { PedidoService } from '../../services/pedido.service';
import {Component, OnInit, inject, OnDestroy} from '@angular/core';
import { PushnotificationService } from 'src/app/services/pushnotification.service';
import { ViewWillEnter, ViewWillLeave, ViewDidLeave } from '@ionic/angular';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-consultas',
  templateUrl: './consultas.page.html',
  styleUrls: ['./consultas.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ConsultasPage implements OnInit, OnDestroy, ViewWillEnter, ViewWillLeave, ViewDidLeave {
  user: any = null;
  newMessage: string = '';
  messageList: any = [];
  data: any = null;
  pressedButton: boolean = false;
  pedido: any = null;
  soundSendMessage: any = new Audio('../../assets/audios/sendMessage.mp3');
  authSrv = inject(AuthService);

  //suscripciones
  sub1: Subscription;
  sub2: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private chatService: ConsultasService,
    private pedidoSrv: PedidoService,
    private pnService: PushnotificationService
  ) {
    this.soundSendMessage.volume = 0.2;
  }
  ionViewDidLeave(): void {
    this.user = null;
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
  }
  ionViewWillEnter(): void {
    this.user = this.authService.getUser();
    this.checkRequest();
    this.sub2 = this.chatService.getMessages().subscribe((messagesA) => {
      if (messagesA !== null) {
        this.messageList = messagesA;
        setTimeout(() => {
          this.scrollToTheLastElementByClassName();
        }, 100);
      }
    });
  }
  ionViewWillLeave(): void {
    this.user = null;
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
  }
  ngOnDestroy(): void {
    this.user = null;
    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
  }

  ngOnInit() {
    /* this.data = null;
    this.user = this.authService.getUser();

    this.chatService.getMessages().subscribe((messagesA) => {
      if (messagesA !== null) {
        this.messageList = messagesA;
        setTimeout(() => {
          this.scrollToTheLastElementByClassName();
        }, 100);
      }
    });
    this.checkRequest(); */
  }

  showChat() {
    this.newMessage = '';
    this.showSpinner(1);
    setTimeout(() => {
      this.scrollToTheLastElementByClassName();
    }, 2100);
  }

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
      mesa: this.pedido?.mesa_numero || ''
    };
    this.chatService.createMessage(message);
    this.newMessage = '';
    this.scrollToTheLastElementByClassName();
    this.soundSendMessage.play();
    this.pnService.enviarNotificacionUsuarios('MOZO', 'Consultas', 'Hay una nueva consulta de un cliente', true);
  }

  showSpinner(chatOption: number) {
    this.pressedButton = true;
    setTimeout(() => {
      this.pressedButton = false;
    }, 2000);
  }

  navigateBack() {
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }

  scrollToTheLastElementByClassName() {
    const elements = document.getElementsByClassName('mensajes');
    const lastElement: any = elements[elements.length - 1];
    const toppos = lastElement.offsetTop;
    document.getElementById('contenedor-mensajes').scrollTop = toppos;
  }
  
  private checkRequest() {
    console.log("user:");
    console.log(this.user);
    this.sub1 = this.pedidoSrv.getLastByUser(this.user.correo)
      .subscribe((data: any[]) => {
        this.pedido = data;
        console.log("BARRA PEDIDO:");
        console.log(this.pedido);
        //a.unsubscribe();
    });
  }
}

