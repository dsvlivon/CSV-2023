import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Mesa } from '../shared/mesa.interface'

@Injectable({
  providedIn: 'root'
})
export class MesaService {

  pathOfCollection = 'mesas';

  referenceToCollection: AngularFirestoreCollection;
  public dbRefMesaCliente: AngularFirestoreCollection<any>;

  constructor(private bd: AngularFirestore) {
    this.referenceToCollection =
      this.bd.collection<Mesa>
        (this.pathOfCollection, ref => ref.orderBy('numero', 'asc'));

        this.dbRefMesaCliente = this.bd.collection("mesas");
  }

  public async setOne(model: Mesa,user_uid:string) {
    try {
      this.AsignarMesaCliente(model.numero, model.id, user_uid, model.estado);
      return this.referenceToCollection.doc(model.id).set({ ...model });
  }
    catch (err) { console.log(err); }
  }

  AsignarMesaCliente( nro_Mesa:number, id_mesa:string, id_usuario:string, estado:string){
    this.dbRefMesaCliente.add(Object.assign({user_uid: id_usuario, id_mesa: id_mesa ,nro_mesa:nro_Mesa, estado:estado}));
  }
 
  getAll() {
    try {
      return this.referenceToCollection.snapshotChanges().pipe(
        map(tables => tables.map(a => a.payload.doc.data()))
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
        map(tables => tables.find(u => u['id'] == id)));
    }
    catch (error) { 
      console.log(error);
      return null; 
    }
  }

  getByNumber(numero: number) {
    try {
      return this.getAll().pipe(
        map(tables => tables.find(u => u['numero'] === numero)));
    } catch (error) {
      console.log(error);
      return null; 
    }
  }

  getByUser(correo: string) {
    try {
      return this.getAll().pipe(
        map(tables => tables.find(u => u['correo'] == correo)));
    }
    catch (error) { 
      console.log(error);
      return null; 
    }
  }

  getComunes() {
    return this.getByType('COMUN') as Observable<Mesa[]>;
  }

  getDiscapacitados() {
    return this.getByType('DISCAPACITADOS') as Observable<Mesa[]>;
  }

  getVips() {
    return this.getByType('VIP') as Observable<Mesa[]>;
  }

  private getByType(tipo: 'COMUN' | 'DISCAPACITADOS' | 'VIP') {
    try {
      return this.getAll().pipe(
        map(tables => tables.filter(u => u['tipo'].includes(tipo))));
    }
    catch (error) { 
      console.log(error);
      return null; 
    }
  }

  getByStatus(estado: 'DISPONIBLE' | 'RESERVADO') {
    try {
      return this.getAll().pipe(
        map(tables => tables.filter(u => u['estado'].includes(estado))));
    }
    catch (error) { 
      console.log(error);
      return null; 
    }
  }
}