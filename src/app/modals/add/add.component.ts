import { ErrorHandlingService } from './../../services/req-handling.service';
import { UploadService } from './../../services/upload.service';
import { DataService } from './../../services/data.service';

import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AngularFireStorage } from '@angular/fire/storage';
import { timeStamp } from 'console';



/** @title Input with a custom ErrorStateMatcher */
@Component({
  selector: "app-add",
  templateUrl: "./add.component.html",
  styleUrls: ["./add.component.scss"]
})
export class AddComponent implements OnInit {

  categoryForm: FormGroup
  storeForm: FormGroup
  categoryName: any;
  storeName: any;
  file :any;
  constructor(
    public dialogRef: MatDialogRef<AddComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private formBuilder: FormBuilder,
    public dataService: DataService,
    public storage: AngularFireStorage,
    public upload: UploadService,
    public handler: ErrorHandlingService,

  ) {

    console.log('%c data inside the model', 'color: yellow', this.data)

    this.buildForm();
  }


  ngOnInit() {


  }


  buildForm() {
    if (this.data.from === 'categories') {
      this.buildCategoryForm();
    }

    if (this.data.from === 'stores') {
      this.buildStoreForm();
    }
  }

  buildCategoryForm() {
    if (this.data.type === 'add') {

      this.categoryForm = this.formBuilder.group({
        name: ["", Validators.required],
        file: ["", Validators.required],
      });

      console.log("model data", this.data);
    }


    if (this.data.type === 'edit') {
      const data = this.data.data;

      this.categoryForm = this.formBuilder.group({
        name: [data.name, Validators.required],
        file: [''],

      });

      console.log("model data", this.data);

    }
  }

  buildStoreForm() {
    if (this.data.type === 'add') {
      this.storeForm = this.formBuilder.group({
        name: ["", Validators.required],
        address: ["", Validators.required],
        city: ["", Validators.required],
        state: ["", Validators.required],
        owner: ["", Validators.required],
        phone: ["", Validators.required]
      });

      console.log("model data", this.data);
    }


    if (this.data.type === 'edit') {
      const data = this.data.data;
      this.storeForm = this.formBuilder.group({
        name: [data.name, Validators.required],
        address: [ data.address.required],
        state: [ data.state, Validators.required],
        city: [ data.city, Validators.required],
        owner: [data.owner, Validators.required],
        phone: [data.phone, Validators.required]
      });

      console.log("model data", this.data);

    }
  }
  add(imageUrl, name) {

    const payload = {
      name: name,
      imageUrl: imageUrl
    };

    if(this.data.from === 'categories') {
      this.categoryName = name;
      this.saveDetails(payload,'categories');
    }

    if(this.data.from === 'stores') {
      this.storeName = name;
      this.saveDetails(payload,'stores');

    }
  }


  saveDetails(payload,db) {
    if (this.data.type === 'add') {
      console.log('form values', name);


      this.dataService.addItem(payload, db)
        .then((response) => {
          this.handler.reqSuccess(response, 'add category');
          if (response["key"]) {
            this.dataService.addkey(response["key"], db);
            this.dialogRef.close(true);
          }
        }).catch((error) => {

          this.handler.reqError(error, db);

        });
    }

    if (this.data.type === 'edit') {
      this.dataService.updateItem(payload, db, this.data.data._id)
        .then((response) => {

          this.handler.reqSuccess(response, `update ${db}`);

          this.dialogRef.close(true);
        }).catch((error) => {
          this.handler.reqError(error, `update ${db}`);
        });
    }
  }

  save(form, values, db) {
    if(this.data.type === 'add') {

      if(this.file.name !== '') {
        this.uploadFileApi(values.name, db);
      }

    }

    if(this.data.type === 'edit') {

      if(this.file) {
        this.uploadFileApi(values.name, db);
      } else {
        this.add(this.data.data.imageUrl, values.name);
      }
    }
    console.log('name', values.name);

  }

  fileUrl(name, db) {
    this.upload.getFileDownloadUrl(db, name.toLowerCase()).subscribe((response) => {
      this.handler.reqSuccess(response, 'getting file url');
      this.add(response, name);

    }, error => {
      this.handler.reqError(error, 'getting file url');
    });
  }

  uploadFileApi(name,db) {
    this.upload.uploadFile(this.file, name.toLowerCase(), 'categories')
    .then((response) => {

      this.handler.reqSuccess(response, 'save');
      if (response["state"] === "success") {

        this.fileUrl(name, db);
      }
    }, error => {
      this.handler.reqError(error, 'save image');
      console.log('%c error while saving the image', 'color: yellow', error);
    });
  }

  uploadFile(event) {
    this.file = event.target.files[0];

    console.log('uploading file', this.file);
  }


}
