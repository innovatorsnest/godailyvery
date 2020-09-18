import { UploadService } from './upload.service';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';


@Injectable({
  providedIn: 'root'
})
export class DataService {


  db: any;
  constructor(
    public database: AngularFireDatabase,
    public uploadService: UploadService,

  ) {    }





  addItem(payload, db) {

    return this.database.list(db).push(payload);

  }



  getItems(db) {
    return this.database.list(db).valueChanges();
  }

  updateItem(payload,db,key) {
    return this.database.list(db).update(key, payload);
  }

  deleteImage(imageUrl) {
    return this.uploadService.deleteFile(imageUrl);
  }

  deleteItem(key,db) {

   return this.database.list(db).remove(key);
  }

  addkey(key,db) {
    this.database.list(db).update(key, {
      _id: key
    });
  }
}


