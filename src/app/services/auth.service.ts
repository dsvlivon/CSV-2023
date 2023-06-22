import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { User2 } from '../shared/user2.interface';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import * as auth from 'firebase/auth';
import { LoadingController, ToastController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { FirestoreService } from './firestore.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  tipo: string;
  
  user$: any;

  constructor(
    private afAuth: AngularFireAuth, 
    private afs: FirestoreService, 
    private router: Router, 
    private ngZone: NgZone,
    public toastController: ToastController
  ) {
    const a = this.afAuth.authState.subscribe(user => {
      this.user$ = user;
      a.unsubscribe();
    })
    
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
  }
  
  isAuth() {
    return this.afAuth.authState.pipe(map(auth => auth))
  }
  async signIn(email, password) {
    return await this.afAuth.signInWithEmailAndPassword(email, password);
  }

  registerUser(email, password) {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  getCurrentUser(){
    return this.afAuth.authState;
  }
  
  async signOut() {
    localStorage.clear();
    await this.afAuth.signOut();
  }

  getUser() {
    let localstorage = localStorage.getItem('user');
    if( localstorage != null) {
      return JSON.parse(localstorage);
    }
  }
}
