import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { ListaEspera } from '../shared/listaEspera.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListaEsperaService {
  listaEspera: Observable<ListaEspera[]>;

  pathOfCollection = 'wait_list';
  referenceToCollection: AngularFirestoreCollection<ListaEspera>;

  constructor(private bd: AngularFirestore) {
    this.referenceToCollection =
      this.bd.collection<ListaEspera>
        (this.pathOfCollection, (ref: { orderBy: (arg0: string, arg1: string) => any; }) => ref.orderBy('date_created', 'asc'));
  }

  getStateChanges(): Observable<any> {
    return this.bd.doc('wait_list').valueChanges();
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
  getList(correo: string) {
    this.referenceToCollection = this.bd.collection('wait_list', ref => ref.where('correo', '==', `${correo}`));
    return this.referenceToCollection.valueChanges();
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
  
  getById(uid: string) {
    try {
      return this.getAll().pipe(
        map((tables: any[]) => tables.find((u: { uid: string; }) => u.uid == uid)));
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
      map((tables: any[]) => {
      console.log('tables', tables)
      tables.slice(-1)[0]}));
  }

  public async updateOne(model: ListaEspera){
    try { return this.bd.doc<any>(`wait_list/${model.id}`).update(model)}
    catch (err) {console.log(err);}
  }

}

