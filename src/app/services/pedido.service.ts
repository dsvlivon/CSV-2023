import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Pedido } from '../shared/pedido.interface';


@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  pathOfCollection = 'pedidos';
  referenceToCollection: AngularFirestoreCollection;

  constructor(private bd: AngularFirestore) {
    this.referenceToCollection =
      this.bd.collection<Pedido>
        (this.pathOfCollection, ref => ref.orderBy('date_created', 'asc'));
  }

  public async createOne(model: Pedido) {
    try {
      model.id = this.bd.createId();
      return await this.referenceToCollection.doc(model.id).set({ ...model });  //  llaves es objeto, 3 puntitos es dinamico
    }
    catch (err) { console.log(err); }
  }

  public async setOne(model: Pedido) {
    try { return this.referenceToCollection.doc(model.id).set({ ...model }); }
    catch (err) { console.log(err); }
  }

  getAll() {
    try {
      return this.referenceToCollection.snapshotChanges().pipe(
        map(pedidos => pedidos.map(a => a.payload.doc.data()))
      );
    }
    catch (error) { return null; }
  }

  getById(id: string) {
    try {
      return this.getAll().pipe(
        map(pedidos => pedidos.find(u => u['id'] == id)));
    }
    catch (error) { return null; }
  }

  getByUser(correo: string, estado?: string) {
    try {
      if (!estado) {
        return this.getAll().pipe(
          map(pedidos => pedidos.filter(u => u['correo'] == correo)));
      }
      else {
        return this.getAll().pipe(
          map(tables => tables.filter(
            u => u['correo'] == correo && u['estado'] == estado
          )));
      }
    }
    catch (error) {  return null;}
  }

  getLastByUser(correo: string, estado?: string) {
    return this.getByUser(correo, estado).pipe(
      map(pedidos => pedidos.slice(-1)[0]));

  }


}
