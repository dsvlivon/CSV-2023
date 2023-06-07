import { Injectable } from '@angular/core';
import { User2 } from '../shared/user2.interface';
import emailjs from 'emailjs-com';
import { init } from 'emailjs-com';
init('4US9Ss8NOSj-6oFtc');

@Injectable({
  providedIn: 'root'
})
export class MailService {

  private serviceID = 'service_rxphepv';
  private templateID = 'template_5p2rx0v';

  constructor() { }

  notificationWelcome(model: User2) {
    let template = {
        from_name: "La Comanda",
        to: model.correo,
        client_name: model.nombre,
        message: "Si recibió este correo electrónico significa que se ha registrado correctamente en La Comanda muchas gracias!",
    }

    try { emailjs.send(this.serviceID, this.templateID, template) }
    catch (error) { console.log("Error al enviar el email.", error); }
}

notificationInabled(model: User2) {
    let template = {
        from_name: "La Comanda CSV",
        to: model.correo,
        client_name: model.nombre,
        message: "Para acceder a la aplicacion debe aguardar a que su cuenta sea activada",
    }

    try { emailjs.send(this.serviceID, this.templateID, template) }
    catch (error) { console.log("Error al enviar el email.", error); }
}

notificationStatus(model: User2) {
    let template = {
        from_name: "La Comanda",
        to: model.correo,
        client_name: model.nombre,
        message: "Usted se encuentra actualmente en estado " + model.estado + " para ingresar al local.",
    }

    try { emailjs.send(this.serviceID, this.templateID, template) }
    catch (error) { console.log("Error al enviar el email.", error); }
}
}