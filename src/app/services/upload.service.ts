import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize, takeLast } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';



@Injectable({
  providedIn: 'root'
})
export class UploadService {

  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  profileUrl: Observable<any>;

  constructor(
    private storage: AngularFireStorage
  ) { }


  uploadFile(image,name, folder) {
    const file = image;
    const filePath = `${folder}/${name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    // observe percentage changes
    // this.uploadPercent = task.percentageChanges();

    task.snapshotChanges().pipe(
        finalize(() => this.downloadURL = fileRef.getDownloadURL() )
     )
     .subscribe();



    return task;
  }

  getFileDownloadUrl(db,file) {
    const ref = this.storage.ref(`${db}/${file}`);
    this.profileUrl = ref.getDownloadURL();
    return this.profileUrl;
  }


  deleteFile(refUrl) {
    return this.storage.storage.refFromURL(refUrl).delete();
  }


}
