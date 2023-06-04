import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class FirestorageService {

  constructor(private firestorage: AngularFireStorage, private afs: AngularFirestore) { }

  updateImgFirestorage(file: string, data: any) {
    return this.firestorage.upload(file,data);
  }

  updateImgFirestore(photo: any, id: any, collection: any) {
    return this.afs.collection(collection).doc(id).update(photo);

  }

  refFile(file: string) {
    return this.firestorage.ref(file);
  }
}
