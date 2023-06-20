import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class ConsultasService {

  constructor(private angularFirestore: AngularFirestore) { }

  getMessages() {
    const collection = this.angularFirestore.collection<any>('consultas', (ref) =>
      ref.orderBy('date', 'asc').limit(50)
    );
    return collection.valueChanges();
  }

  createMessage(message: any) {
    this.angularFirestore.collection<any>('consultas').add(message);
  }

}
