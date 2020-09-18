import { ErrorHandlingService } from './../../services/req-handling.service';
import { UploadService } from './../../services/upload.service';
import { DataService } from './../../services/data.service';

import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AngularFireStorage } from '@angular/fire/storage';


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
  file: any;
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
      console.log('building store form');
      this.buildStoreForm();
    }
  }

  buildCategoryForm() {
    if (this.data.type === 'add') {

      this.categoryForm = this.formBuilder.group({
        name: ["", Validators.required],
        imageUrl: ["", Validators.required],
      });

      console.log("model data", this.data);
    }


    if (this.data.type === 'edit') {
      const data = this.data.data;

      this.categoryForm = this.formBuilder.group({
        name: [data.name, Validators.required],
        imageUrl: [''],
      });

      console.log("model data", this.data);

    }
  }

  buildStoreForm() {
    if (this.data.type === 'add') {
      this.storeForm = this.formBuilder.group({
        name: ["", Validators.required],
        imageUrl: ["", Validators.required],
        address: ["", Validators.required],
        city: ["", Validators.required],
        state: ["", Validators.required],
        owner: ["", Validators.required],
        phone: ["", Validators.required],
      });

      console.log("model data", this.data);
    }


    if (this.data.type === 'edit') {
      const data = this.data.data;
      this.storeForm = this.formBuilder.group({
        name: [data.name, Validators.required],
        address: [data.address, Validators.required],
        imageUrl: [""],
        state: [data.state, Validators.required],
        city: [data.city, Validators.required],
        owner: [data.owner, Validators.required],
        phone: [data.phone, Validators.required]
      });

      console.log("model data", this.data);

    }
  }
  add(data) {

    if (this.data.from === 'categories') {
      const payload = {
        name: data.name,
        imageUrl: data.imageUrl
      };


      this.categoryName = data.name;
      this.saveDetails(payload, 'categories');
    }

    if (this.data.from === 'stores') {
      const payload = {
        name: data.name,
        imageUrl: data.imageUrl,
        owner: data.owner,
        address: data.address,
        phone: data.phone,
        state: data.state,
        city: data.city
      };
      this.storeName = data.name;
      this.saveDetails(payload, 'stores');
    }
  }


  saveDetails(payload, db) {
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

      console.log('payload before sending it to the edit ', payload);
      console.log('id to update the picture  ', this.data.data);

      const newPayload = {
        data: payload,
        _id: this.data.data._id
      };

      console.log('new payload data  ', newPayload);
      console.log('data previous  ', this.data.data);




      this.dataService.updateItem(newPayload.data, db, newPayload._id)
        .then((response) => {

          this.handler.reqSuccess(response, `update ${db}`);

          this.dialogRef.close(true);
        }).catch((error) => {
          this.handler.reqError(error, `update ${db}`);
        });






    }
  }

  save(form, values, db) {
    console.log('values', values);
    if (this.data.type === 'add') {

      if (this.file.name !== '') {
        this.uploadFileApi(values, db);
      }

    }

    if (this.data.type === 'edit') {

      const previousData = { ...this.data.data };

      if (this.file) {
        this.dataService.deleteImage(this.data.data.imageUrl)
          .then((res) => {
            this.uploadFileApi(values, db);
          })
          .catch((error) => {
            this.handler.reqError(error, 'delete image');
          })
      } else {
        values.imageUrl = this.data.data.imageUrl;
        this.add(values);
      }
    }


  }

  fileUrl(values, db) {
    console.log('getting the file url of the new data', values);
    this.upload.getFileDownloadUrl(db, values.name.toLowerCase()).subscribe((response) => {
      this.handler.reqSuccess(response, 'getting file url');
      console.log('previous file url values', values);
      if (response) {
        values.imageUrl = response;
        console.log('updating the new file url', values);
        this.add(values);
      }

    }, error => {
      this.handler.reqError(error, 'getting file url');
    });
  }

  uploadFileApi(values, db) {

    this.upload.uploadFile(this.file, values.name.toLowerCase(), db)
      .then((response) => {

        this.handler.reqSuccess(response, 'save');
        if (response["state"] === "success") {

          this.fileUrl(values, db);
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
