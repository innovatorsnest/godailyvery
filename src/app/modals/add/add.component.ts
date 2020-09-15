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
  categoryName: any;
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
    if (this.data.type === 'add') {
      this.categoryForm = this.formBuilder.group({
        name: ["", Validators.required]
      });

      console.log("model data", this.data);
    }


    if (this.data.type === 'edit') {
      this.categoryForm = this.formBuilder.group({
        name: [this.data.data.name, Validators.required]
      });

      console.log("model data", this.data);

    }


  }
  addCategory(imageUrl, name) {

    this.categoryName = name;
    const payload = {
      name: name,
      imageUrl: imageUrl
    };

    if (this.data.type === 'add') {
      console.log('form values', name);


      this.dataService.addItem(payload, 'categories')
        .then((response) => {
          this.handler.reqSuccess(response, 'add category');
          if (response["key"]) {
            this.dataService.addkey(response["key"], 'categories');
            this.dialogRef.close(true);
          }
        }).catch((error) => {

          this.handler.reqError(error, 'add category');

        });
    }

    if (this.data.type === 'edit') {
      this.dataService.updateItem(payload, 'categories', this.data.data._id)
        .then((response) => {

          this.handler.reqSuccess(response, 'update category');


          this.dialogRef.close(true);
        }).catch((error) => {
          this.handler.reqError(error, 'update category');
          console.log('%c error of the add category', 'color: yellow', error);
        });
    }

  }


  save(form, values) {
    console.log('category name', values.name);
    this.upload.uploadFile(this.file, values.name, 'categories')
      .then((response) => {

        this.handler.reqSuccess(response, 'save');
        if (response["state"] === "success") {
          this.fileUrl(values.name);

        }
      }, error => {
        this.handler.reqError(error, 'save image');
        console.log('%c error while saving the image', 'color: yellow', error);
      });

  }

  fileUrl(name) {
    this.upload.getFileDownloadUrl('categories', name).subscribe((response) => {
      this.handler.reqSuccess(response, 'getting file url');
        this.addCategory(response,name);

    }, error => {
      this.handler.reqError(error, 'getting file url');
    })
  }

  uploadFile(event) {
    this.file = event.target.files[0];

  }


}
