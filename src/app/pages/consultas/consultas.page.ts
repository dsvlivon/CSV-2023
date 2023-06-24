import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ViewDidEnter } from '@ionic/angular';
import { Router } from '@angular/router';
import { ConsultasService } from 'src/app/services/consultas.service';
import { AuthService } from '../../services/auth.service';
import * as moment from 'moment';
import { PedidoService } from '../../services/pedido.service';
import { Component, OnInit, inject, OnDestroy } from '@angular/core';
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
export class ConsultasPage implements OnInit, OnDestroy {
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


  ngOnInit() {
    this.user = this.authService.getUser();
    this.user = this.authService.getUser();
    this.checkRequest();
    this.sub2 = this.chatService.getMessages().subscribe((messagesA) => {
      if (messagesA !== null) {
        console.log('en otra linea', this.sub2)

        this.messageList = messagesA;
        this.sub2.unsubscribe();
        setTimeout(() => {
          this.scrollToTheLastElementByClassName();
        }, 100);
      }
    });
    console.log('en oninit', this.sub2)
  }
  ngOnDestroy(): void {
    this.user = null;
    this.data = null;

    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
    console.log('en destroy', this.sub2);
    console.log('en destroy sub 1', this.sub1);

    console.log(this.user);
  }

 /*  ionViewDidEnter(): void {
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
  ionViewWillEnter(): void {
  }
  ionViewDidLeave(): void {
    console.log(this.sub1);

    this.sub1.unsubscribe();
    this.sub2.unsubscribe();
  }

  ionViewWillLeave(): void {
    this.user = null;

    this.sub1.unsubscribe();
    this.sub2.unsubscribe();

  } */


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
    this.sub1 = this.pedidoSrv.getLastByUser(this.user.correo)
      .subscribe((data: any[]) => {
        this.pedido = data;
        this.sub1.unsubscribe();
      });
  }
}

