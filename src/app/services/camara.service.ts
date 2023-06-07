import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FirestoreService } from './firestore.service';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { getStorage, ref, uploadString } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class CamaraService {
  user: any = null;

  constructor(
    private authService: AuthService,
    private angularFirestorage: AngularFireStorage,
    private firestoreService: FirestoreService
  ) {
    this.authService.user$.subscribe((user: any) => {
      if (user) {
        this.user = user;
        console.log(this.user);
      }
    });
  }

  async addNewToGallery(photo: any, type: number) {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
      quality: 100,
      webUseInput: true,
    });

    const storage = getStorage();
    const date = new Date().getTime();

    photo.hour = date;

    const name = `${this.user.mail} ${date}`;
    const storageRef = ref(storage, name);
    console.log("photoservice storageRef: "+ name);
    const url = this.angularFirestorage.ref(name);
    console.log("photoservice url: "+ name);

    uploadString(storageRef, capturedPhoto.dataUrl, 'data_url').then(() => {
      url.getDownloadURL().subscribe((url1: any) => {
        photo.pathFoto = url1;
        //this.firestoreService.addPhoto(photo, type);
        // this.authService.toast('Foto subida con exito', 'success');
      });
    });
  } // end of addNewToGallery

}
