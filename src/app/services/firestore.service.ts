import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { User2 } from '../shared/user2.interface';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root',
})
export class FirestoreService {

  user: any;
  collection = 'usuarios';
  ref: AngularFirestoreCollection;
  constructor(private angularFirestore: AngularFirestore, private authSrv: AuthService) {
    this.ref = this.angularFirestore.collection<User2>(this.collection);
    this.authSrv.user$.subscribe(user => {
      this.user = user;
    })
  }

  async addUser(user: User2) {
    try {
      return this.ref.doc(this.user.uid).set({ ...user });
    } catch (error) {
      console.log(error)
    }
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
}
