import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class DataService {


  db: any;
  constructor(
    public database: AngularFireDatabase
  ) {



  }




  addItem(payload, db) {

    return this.database.list(db).push(payload);

  }



  getItems(db) {
    return this.database.list(db).valueChanges();
  }

  updateItem(payload,db,key) {
    return this.database.list(db).update(key, {
      name: payload.name
    });
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


