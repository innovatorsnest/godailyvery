// import { ObservableService } from './../../services/observable.service';
import { ErrorHandlingService } from './../../services/req-handling.service';
import { UploadService } from './../../services/upload.service';
import { DataService } from './../../services/data.service';

import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Component, Inject, OnInit, TestabilityRegistry } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AngularFireStorage } from '@angular/fire/storage';
import { ObservableService } from 'src/app/services/observable.service';



/** @title Input with a custom ErrorStateMatcher */
@Component({
  selector: "app-add",
  templateUrl: "./add.component.html",
  styleUrls: ["./add.component.scss"]
})
export class AddComponent implements OnInit {


  categoryForm: FormGroup
  storeForm: FormGroup
  categoriesForm: FormGroup
  category: any;
  storeName: any;
  file: any;
  tiles = [];
  categories: any[];
  categoryId: any;
  categoryName: any;
  productForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<AddComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private formBuilder: FormBuilder,
    public dataService: DataService,
    public storage: AngularFireStorage,
    public upload: UploadService,
    public handler: ErrorHandlingService,
    public observable: ObservableService,
  ) {

    console.log('%c data inside the model', 'color: yellow', this.data)
    this.buildForm();

  }


  ngOnInit() {
    this.observable.updateSpinnerStatus(false);
  }





  buildForm() {

    if (this.data.from === 'categories') {
      this.buildCategoryForm();
    }

    if (this.data.from === 'stores') {
      console.log('building store form');
      this.buildStoreForm();
    }

    if (this.data.from === 'products') {
      console.log('building product form');
      this.buildProductForm();
    }

    if (this.data.from === 'add-tiles') {

      if (!this.data.data.tiles) {
        this.data.data["tiles"] = [];
      } else {
        this.tiles = this.data.data.tiles;
      }

      this.buildCategoriesForm();

      console.log('data here', this.data.data);
    }
  }

  buildCategoriesForm() {
    this.categoriesForm = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  buildProductForm() {

    console.log('tiles', this.data.tiles);
    if (this.data.type === 'add') {

      this.productForm = this.formBuilder.group({
        name: ['', Validators.required],
        imageUrl: ['', Validators.required],
        type: [null, Validators.required],
        price: ['', Validators.required],
        description: ['', Validators.required]
      });

      console.log('model data', this.data);
    }

    if (this.data.type === 'edit') {

      console.log('data inside the edit product', this.data.data);

      const data = this.data.data;

      this.productForm = this.formBuilder.group({
        name: [data.name, Validators.required],
        imageUrl: [''],
        type: [data.type, Validators.required],
        price: [data.price, Validators.required],
        description: [data.description, Validators.required]
      });

      console.log('model data', this.data);
    }

  }

  buildCategoryForm() {
    if (this.data.type === 'add') {

      this.categoryForm = this.formBuilder.group({
        name: ['', Validators.required],
        imageUrl: ['', Validators.required],
      });

      console.log('model data', this.data);
    }

    if (this.data.type === 'edit') {
      const data = this.data.data;

      this.categoryForm = this.formBuilder.group({
        name: [data.name, Validators.required],
        imageUrl: [''],
      });

      console.log('model data', this.data);
    }

  }

  buildStoreForm() {
    this.category = null;

    if (this.data.type === 'add') {

      this.storeForm = this.formBuilder.group({
        name: ['', Validators.required],
        imageUrl: ['', Validators.required],
        address: ['', Validators.required],
        city: ['', Validators.required],
        category: [null, Validators.required],
        state: ['', Validators.required],
        owner: ['', Validators.required],
        from: ['', Validators.required],
        to: ['', Validators.required],
        phone: ['', Validators.required]
      });

      console.log('model data', this.data);
    }


    if (this.data.type === 'edit') {

      const data = this.data.data;
      this.findCategoryName(data.categoryId);

      if (this.categoryName) {
        this.storeForm = this.formBuilder.group({
          name: [data.name, Validators.required],
          address: [data.address, Validators.required],
          imageUrl: [''],
          category: [this.categoryName, Validators.required],
          state: [data.state, Validators.required],
          city: [data.city, Validators.required],
          from: [data.from, Validators.required],
          to: [data.to, Validators.required],
          owner: [data.owner, Validators.required],
          phone: [data.phone, Validators.required]
        });

        console.log('model data', this.data);
      }
    }
  }
  add(data) {

    if (this.data.from === 'categories') {
      const payload = {
        name: data.name,
        imageUrl: data.imageUrl
      };

      this.saveDetails(payload, 'categories');
    }

    if (this.data.from === 'stores') {

      console.log('%c payload of data inside the store', 'color: green', data);

      this.findCategoryId(data.category);

      if (this.categoryId) {
        const payload = {
          name: data.name,
          imageUrl: data.imageUrl,
          owner: data.owner,
          address: data.address,
          phone: data.phone,
          categoryId: this.categoryId,
          state: data.state,
          city: data.city,
          from: data.from,
          to: data.to,
          storeStatus: true,
          tiles: []
        };

        this.storeName = data.name;
        this.saveDetails(payload, 'stores');
      }
    }

    if (this.data.from === 'products') {

      const payload = {
        name: data.name,
        price: data.price,
        description: data.description,
        type: data.type,
        imageUrl: data.imageUrl,
        inStock: true
      };

      this.saveProducts(payload, 'products');

    }

  }


  saveDetails(payload, db) {

    if (this.data.type === 'add') {
      console.log('form values', name);
      this.dataService.addItem(payload, db)
        .then((response) => {
          this.handler.reqSuccess(response, 'add category');
          if (response['key']) {
            this.dataService.addkey(response['key'], db);
            this.observable.updateSpinnerStatus(false);
            this.dialogRef.close(true);
          }
        })
        .catch((error) => {
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
          this.observable.updateSpinnerStatus(false);
          this.dialogRef.close(true);
        }).catch((error) => {
          this.handler.reqError(error, `update ${db}`);
        });
    }
  }

  saveProducts(payload, db) {
    console.log('payload', payload);
    console.log('data', this.data.data);
    if (this.data.type === 'add') {
      this.data.data.push(payload);
      this.dataService.addItemToStore(this.data.data, 'stores', this.data.key)
        .then((response) => {
          this.observable.updateSpinnerStatus(false);
          this.dialogRef.close(true);
        })
        .catch((error) => {
          this.handler.reqError(error, db);
        });
    }

    if (this.data.type === 'edit') {
      console.log('%c payload of the edit ', 'color: yellow', payload)
      this.data.products[this.data.index] = payload;
      console.log('data inside the products', this.data.products);
      this.dataService.updateProductsOfStore('stores', this.data.key, this.data.products)
        .subscribe((response) => {
          this.observable.updateSpinnerStatus(false);
          this.dialogRef.close(true);
          this.handler.reqSuccess(response, 'Edit products');
        }, error => {
          this.handler.reqError(error, 'Edit products');
        });
    }

  }

  save(form, values, db) {
    console.log('values', values);
    console.log('data type', this.data);

    this.observable.updateSpinnerStatus(true);


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
          });
      } else {
        values.imageUrl = this.data.data.imageUrl;
        this.add(values);
      }
    }
  }

  findCategoryId(category) {
    console.log('all categories', this.data.data.categories);
    this.data.data.categories.forEach((item, i) => {
      console.log('item', item);

      if (category === item.name) {
        console.log(' Matched Category ', category);
        console.log(' Matched Category Index', i);
        this.categoryId = item._id;
      }
    });
  }


  findCategoryName(id) {
    console.log('_id', id);

    const index = this.data.data.categories.forEach((item, i) => {
      console.log('item ', item);
      if (item._id === id) {
        console.log(' Matched Category ', id);
        console.log(' Matched Category Index', i);
        this.categoryName = item.name;
      }
    });
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
        if (response['state'] === 'success') {
          this.fileUrl(values, db);
        }
      },
        error => {
          this.handler.reqError(error, 'save image');
          console.log('%c error while saving the image', 'color: yellow', error);
        });
  }

  uploadFile(event) {
    this.file = event.target.files[0];
    console.log('uploading file', this.file);
  }


  tileOperation(type, values, index) {

    if (type === 'add') {
      console.log('values', values);
      this.tiles.push(values.name);
      this.categoriesForm.reset();
    }

    if (type === 'save') {
      this.dataService.addTileToStore('stores', this.data.key, this.tiles)
        .subscribe((response) => {
          this.handler.reqSuccess(response, 'Add Stores Save');
          this.categoriesForm.reset();
          this.dialogRef.close(true);
        },
          error => {
            this.handler.reqError(error, 'Error While Stores');
          });
    }

    if (type === 'delete') {
      this.tiles.splice(index, 1);
    }
  }

}
