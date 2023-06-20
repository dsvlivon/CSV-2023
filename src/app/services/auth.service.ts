import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { User2 } from '../shared/user2.interface';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import * as auth from 'firebase/auth';
import { LoadingController, ToastController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  tipo: string;
  
  user$: Observable<User2>;
  public userData: any;

  constructor(
    private afAuth: AngularFireAuth, 
    private afs: AngularFirestore, 
    private router: Router, 
    private ngZone: NgZone,
    public toastController: ToastController
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
         const usuario = this.afs
         .doc<User2>(`usuarios/${user.uid}`)
         .valueChanges();
          return usuario;
        } else {
          return of(null);
        }
      })
    );
    this.user$.subscribe(data => {
      localStorage.setItem('user', JSON.stringify(data));
        JSON.parse(localStorage.getItem('user'));
    })
    
    this.afAuth.authState.subscribe((user) => {

      if(user){
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));

      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'))
      }
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
  

  signIn(email, password) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  registerUser(email, password) {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  sendVerification() {
    return this.afAuth.currentUser.then((user) => {
      return user.sendEmailVerification().then(() => {
        this.router.navigate(['login']);
      })
    })
  }

  passwordRecover(passwordResetEmail) {
    return this.afAuth.sendPasswordResetEmail(passwordResetEmail).then(() => {
      console.log('Password reset email has been send email, please check your inbox');
    }).catch((error) => {
      console.log('Error: ',error);
    })
  }

  /* Returns true when users is logged in */
  isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null ? true : false;
  }
  
  /* Return true when users email is verified */
  get isEmailVerified(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user.emailVerified !== false ? true : false;
  }

  signOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      // this.user$=null;
      this.router.navigate(['login']);
    })
  }
}
