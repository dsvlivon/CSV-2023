import { Injectable } from '@angular/core';
import {
  ActionPerformed,
  PushNotifications,
  PushNotificationSchema,
  Token,
} from '@capacitor/push-notifications';
import { Platform } from '@ionic/angular';
import { Firestore, doc, docData, updateDoc } from '@angular/fire/firestore';
import { LocalNotifications } from '@capacitor/local-notifications';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class PushnotificationService {

  public user: any;
  constructor(
    private platform: Platform,
    //private firestore: Firestore,
    private http: HttpClient,
    //private angularFirestore:AngularFirestore,
    private firestoreService: FirestoreService
  ) {

  }

  async inicializar(): Promise<void> {
    this.addListeners();
    // Verificamos que este en un dispositivo y no en una PC y tambien que el usuario no tegna seteado el token
    if (this.platform.is('capacitor')) {
      const result = await PushNotifications.requestPermissions();
      if (result.receive === 'granted') {
        await PushNotifications.register();
      }
    }
  }

  getUser(user:any): void {
    // const aux = doc(this.firestore, 'usuarios/'+id);
    // docData(aux, { idField: 'id' }).subscribe(async (user) => {
    //   console.log(user);
    //   this.user = user;
    //   this.inicializar();
    // });
      this.user = user;
     /*  console.log(this.user); */
      //this.firestoreService.updateUsuario(this.user.)
      //console.log(this.user);
      //const token = {token: "lala"};
      //this.firestoreService.updateUsuario(this.user.uid,token);
      //this.firestoreService.addToken(token);
      this.inicializar();
  }

  sendPushNotification(req): Observable<any> {
    return this.http.post<Observable<any>>(environment.fcmUrl, req, {
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Authorization: `key=${environment.fcmServerKey}`,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/json',
      },
    });
  }

  private async addListeners(): Promise<void> {
    //Ocurre cuando el registro de las push notifications finaliza sin errores
    await PushNotifications.addListener(
      'registration',
      async (token: Token) => {
        //alert("TOKEN: "+token.value);
        const tokenBD = {token: token.value};
        //this.firestoreService.addToken(tokenBD);
        //Acá deberiamos asociar el token a nuestro usario en nuestra bd
        //alert('Registration token: '+token.value);
        this.firestoreService.updateUsuario(this.user.uid,tokenBD);
        //alert(JSON.stringify(this.user));
        /*const aux = doc(this.firestore, `usuarios/${this.user.id}`);
        await updateDoc(aux, {
          token: token.value,
        });*/
      }
    );

    //Ocurre cuando el dispositivo recive una notificacion push
    await PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        //Este evento solo se activa cuando tenemos la app en primer plano
        /* console.log('Push notification received: ', notification);
        console.log('data: ', notification.data); */
        //Esto se hace en el caso de que querramos que nos aparezca la notificacion en la task bar del celular ya que por
        //defecto las push en primer plano no lo hacen, de no ser necesario esto se puede sacar.
        LocalNotifications.schedule({
          notifications: [
            {
              title: notification.title || '',
              body: notification.body || '',
              id: new Date().getMilliseconds(),
              extra: {
                data: notification.data,
              },
            },
          ],
        });
      }
    );

    //Ocurre cuando se realiza una accion sobre la notificacion push
    await PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        //Este evento solo se activa cuando tenemos la app en segundo plano y presionamos sobre la notificacion
        console.log(
          'Push notification action performed',
          notification.actionId,
          notification.notification
        );
      }
    );

     //Ocurre cuando se realiza una accion sobre la notificacion local
     await LocalNotifications.addListener(
      'localNotificationActionPerformed',
      (notificationAction) => {
        console.log('action local notification', notificationAction);
      }
    );
  }

  enviarNotificacionUsuarios(perfil:string, titulo:string, body:string, rol:any = false)
  {
    let usuariosTokens: any[] = [];
    let sub:any;
    if(rol){
      sub = this.firestoreService.getByRol(perfil);
    }
    else{
      sub = this.firestoreService.getByPerfil(perfil);
    }

    let sub2 = sub.subscribe((data) => {
     /*  console.log(data); */
        data.forEach(element => {
          usuariosTokens.push(element.token);
          /* console.log('token', element.token); */
        });
        /* console.log('usuariosTokens', usuariosTokens); */
      let push = this.sendPushNotification({
        registration_ids: usuariosTokens,
        notification:{
          title: titulo,
          body: body
        }
      }).subscribe((data) => {
        /* console.log(data); */
        push.unsubscribe();
      });
      sub2.unsubscribe();
    });
  }


}
