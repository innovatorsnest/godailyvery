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

  ) { }





  addItem(payload, db) {

    return this.database.list(db).push(payload);

  }


  addItemToStore(payload, parentdb, key) {
    return this.database.list(parentdb).update(key, {
      products: payload
    });
  }

  updateStoreOnlineStatus(db, key, status) {
    const data = this.database.list(db).update(key, {
      storeStatus: status
    })

    return data;
  }

  updateProductsOfStore(db, key, productsArray) {

    const data = this.database.list(db, ref => {
      return ref.orderByKey().equalTo(key)
    });

    data.update(key, {
      products: productsArray
    });

    return data.valueChanges();
  }


  getProductsOfStore(db, key) {
    const data = this.database.list(db, ref => {
      return ref.orderByKey().equalTo(key);
    });

    console.log('%c data of all the stores inside the category', 'color: yellow', data);
    return data.valueChanges();
  }

  getSpecificStore(db, key) {
    const data = this.database.list(db, ref => {
      return ref.orderByKey().equalTo(key);
    });

    return data.valueChanges();
  }

  addTileToStore(db, key, tiles) {
    const data = this.database.list(db, ref => {
      return ref.orderByKey().equalTo(key);
    });

    data.update(key, {
      tiles: tiles
    });

    return data.valueChanges();
  }


  getItems(db) {
    return this.database.list(db).valueChanges();
  }

  updateItem(payload, db, key) {
    return this.database.list(db).update(key, payload);
  }

  deleteImage(imageUrl) {
    return this.uploadService.deleteFile(imageUrl);
  }

  deleteItem(key, db) {

    return this.database.list(db).remove(key);
  }

  addkey(key, db) {
    this.database.list(db).update(key, {
      _id: key
    });
  }
}


