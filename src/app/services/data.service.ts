import { Injectable, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class DataService implements OnInit {

  db: any;
  constructor(
    public database: AngularFireDatabase
  ) {


  }

  ngOnInit() {

  }

  addCategory(name) {
    // this.db.push({
    //   name: name
    // });
    console.log('name', name)
    this.db.push({
      name: name
    })
    // this.database.list("categories").push({
    //   name: name
    // });
  }


  getAllCategories() {

  }

  updateCategory() {

  }


  deleteCategory() {

  }
}


