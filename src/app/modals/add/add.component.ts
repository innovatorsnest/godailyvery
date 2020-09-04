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

  categoryForm :FormGroup

  constructor(
    public dialogRef: MatDialogRef<AddComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private formBuilder: FormBuilder,
    private dataService: DataService,
  ) {

  }


  ngOnInit() {

    this.categoryForm = this.formBuilder.group({
      name: ["", Validators.required]
    });

    console.log("model data", this.data);
  }

  addCategory(form,values) {
    console.log('form values', values);

    this.dataService.addCategory(values.name);

  }

}
