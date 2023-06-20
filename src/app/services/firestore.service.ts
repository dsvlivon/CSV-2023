import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, map } from 'rxjs';
import { User2 } from '../shared/user2.interface';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root',
})
export class FirestoreService {

  user: any;
  collection = 'usuarios';
  ref: AngularFirestoreCollection;
  ref2: AngularFirestoreCollection;
  constructor(private angularFirestore: AngularFirestore, private authSrv: AuthService) {
    this.ref = this.angularFirestore.collection<User2>(this.collection);
    this.ref2 = this.angularFirestore.collection<any>('token');
    this.authSrv.user$.subscribe(user => {
      this.user = user;
    })
  }

  async addUser(user: User2, id?: string) {
    try {

      return this.ref.doc(id).set({ ...user });
    } catch (error) {
      console.log(error)
    }
  }


  async addToken(token: any) {
    try {
      return this.ref2.doc().set(token);
    }
    catch (error) {
      console.log(error);
    }
  }

  getByMail(mail: string) {

    const collection = this.angularFirestore.collection<any>(
      'usuarios',
      (ref) => ref.where('correo', '==', mail)
    );

    return collection.valueChanges();
  }

  getByRol(rol: string) {
    const collection = this.angularFirestore.collection<any>(
      'usuarios',
      (ref) => ref.where('rol', '==', rol)
    );

    return collection.valueChanges();
  }

  getByPerfil(perfil: string) {
    const collection = this.angularFirestore.collection<any>(
      'usuarios',
      (ref) => ref.where('perfil', '==', perfil)
    );

    return collection.valueChanges();
  }

  async updateUsuario(id: string, token: any) {
    //console.log(id);
    //console.log(token);
    await this.angularFirestore
      .doc<any>(`usuarios/${id}`)
      .update(token)
      .then(() => { })
      .catch((error) => {
        //console.log(error.message);
      });
  }

  getClientes() {
    const collection = this.angularFirestore.collection<any>('usuarios', (ref) => ref.where('perfil', '==', 'CLIENTE'));
    return collection.valueChanges();
  }

  async updateEstadoUsuario(usuario: any) {
    await this.angularFirestore
      .doc<any>(`usuarios/${usuario.uid}`)
      .update(usuario)
      .then(() => { console.log("actualizo") })
      .catch((error) => {
        console.log(error.message);
      });
  }

  /*  createMonthlyControl(control: any) {
     return this.angularFirestore
       .collection<any>('controlesMensuales')
       .add(control)
       .then((data) => {
         this.angularFirestore
           .collection('controlesMensuales')
           .doc(data.id)
           .set({
             id: data.id,
             ...control,
           });
       })
       .catch((error) => {
         console.log(error.message);
       });
   }
 
   getMonthlyControls(uid: number) {
     const collection = this.angularFirestore.collection<any>(
       'controlesMensuales',
       (ref) => ref.where('userUid', '==', uid)
     );
     collection.valueChanges().subscribe(data => {
       console.log("xxx:", data);
     });
 
     return collection.valueChanges();
   }
 
   async updateControl(control: any) {
     await this.angularFirestore
       .doc<any>(`controlesMensuales/${control.id}`)
       .update(control)
       .then(() => {})
       .catch((error) => {
         console.log(error.message);
       });
   } */ // end of updateUser

  public addData(collection: string, json) {
    this.angularFirestore.collection(collection).add(json);
  }
}
