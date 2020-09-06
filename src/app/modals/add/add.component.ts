import { DataService } from './../../services/data.service';

import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';


/** @title Input with a custom ErrorStateMatcher */
@Component({
  selector: "app-add",
  templateUrl: "./add.component.html",
  styleUrls: ["./add.component.scss"]
})
export class AddComponent implements OnInit {

  categoryForm: FormGroup

  constructor(
    public dialogRef: MatDialogRef<AddComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private formBuilder: FormBuilder,
    public dataService: DataService,
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
  addCategory(form, values) {
    const payload = {
      name: values.name
    };

    if (this.data.type === 'add') {
      console.log('form values', values);


      this.dataService.addItem(payload,'categories')
        .then((response) => {
          console.log('%c response of the add category', 'color: yellow', response);
          if (response["key"]) {
            this.dataService.addkey(response["key"], 'categories');
            this.dialogRef.close(true);
          }
        }).catch((error) => {
          console.log('%c error of the add category', 'color: yellow', error);
        });
    }

    if (this.data.type === 'edit') {
      this.dataService.updateItem(payload, 'categories', this.data.data._id)
      .then((response) => {
        console.log('%c response of the update category', 'color: yellow', response);
        this.dialogRef.close(true);
      }).catch((error) => {
        console.log('%c error of the add category', 'color: yellow', error);
      });
    }

  }


}
