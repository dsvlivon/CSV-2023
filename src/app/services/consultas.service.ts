import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class ConsultasService {

  constructor(private angularFirestore: AngularFirestore) { }

  getMessagesA() {
    const collection = this.angularFirestore.collection<any>('consultas', (ref) =>
      ref.orderBy('date', 'asc').limit(50)
    );
    return collection.valueChanges();
  }

  createMessageA(message: any) {
    this.angularFirestore.collection<any>('consultas').add(message);
  }

}
