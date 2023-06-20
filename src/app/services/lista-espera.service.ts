import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { ListaEspera } from '../shared/listaEspera.interface';

@Injectable({
  providedIn: 'root'
})
export class ListaEsperaService {
  pathOfCollection = 'wait_list';
  referenceToCollection: AngularFirestoreCollection;

  constructor(private bd: AngularFirestore) {
    this.referenceToCollection =
      this.bd.collection<ListaEspera>
        (this.pathOfCollection, (ref: { orderBy: (arg0: string, arg1: string) => any; }) => ref.orderBy('date_created', 'asc'));
  }

  public async createOne(model: ListaEspera) {
    try {
      model.id = this.bd.createId();
      return await this.referenceToCollection.doc(model.id).set({ ...model });  //  llaves es objeto, 3 puntitos es dinamico
    }
    catch (err) { console.log(err); }
  }

  public async setOne(model: ListaEspera) {
    try { return this.referenceToCollection.doc(model.id).set({ ...model }); }
    catch (err) { console.log(err); }
  }

  getInactivos() {
    try {
      return this.getAll().pipe(
        map((waits: any[]) => waits.filter(
          (u: { estado: string; }) => u.estado == 'CANCELADO' || u.estado == 'FINALIZADO'
        )));
    }
    catch (error) {
      console.log(error);
      return null;
     }
  }

  getActivos() {
    try {
      return this.getAll().pipe(
        map((waits: any[]) => waits.filter(
          (u: { estado: string; }) => u.estado == 'PENDIENTE' || u.estado == 'EN USO'
        )));
    }
    catch (error) { 
      console.log(error);
      return null;
    }
  }

  getAll() {
    try {
      return this.referenceToCollection.snapshotChanges().pipe(
        map((waits: any[]) => waits.map((a: { payload: { doc: { data: () => any; }; }; }) => a.payload.doc.data()))
      );
    }
    catch (error) {
      console.log(error);
      return null;
     }
  }

  getById(id: string) {
    try {
      return this.getAll().pipe(
        map((tables: any[]) => tables.find((u: { id: string; }) => u.id == id)));
    }
    catch (error) { 
      console.log(error);
      return null;
    }
  }

  getByUser(correo: string, estado?: string) {
    try {
      if (!estado) {
        return this.getAll().pipe(
          map((tables: any[]) => tables.filter((u: { correo: string; }) => u.correo == correo)));
      }
      else {
        return this.getAll().pipe(
          map((tables: any[]) => tables.filter(
            (u: { correo: string; estado: string; }) => u.correo == correo && u.estado == estado
          )));
      }
    }
    catch (error) { 
      console.log(error);
      return null;
    }
  }

  getLastByUser(correo: string, estado?: string) {
    return this.getByUser(correo, estado).pipe(
      map((tables: any[]) => tables.slice(-1)[0]));
  }

  public async updateOne(model: ListaEspera){
    try { return this.bd.doc<any>(`wait_lista/${model.id}`).update(model)}
    catch (err) {console.log(err);}
  }

}

