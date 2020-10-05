import { ObservableService } from './../../services/observable.service';
import { ErrorHandlingService } from './../../services/req-handling.service';
import { UploadService } from './../../services/upload.service';
import { DataService } from './../../services/data.service';
import { ModalService } from './../../services/modal.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddComponent } from 'src/app/modals/add/add.component';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';



@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.scss']
})
export class StoresComponent implements OnInit {

  storeForm: FormGroup;
  stores: any;
  categories: unknown[];

  constructor(
    private modalService: ModalService,
    private dataService: DataService,
    private storage: AngularFireStorage,
    private uploadService: UploadService,
    private handler: ErrorHandlingService,
    private observable: ObservableService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {

    this.storeForm = formBuilder.group({
      storeStatus: ''
    });

  }

  allCategories: any[];

  ngOnInit() {
    this.getAllCategories();
    this.getAllStores();
  }


  getAllCategories() {
    this.observable.updateSpinnerStatus(true);
    this.dataService.getItems('categories').subscribe((response) => {
      console.log('%c response from getting the data service', 'color: yellow', response);
      this.categories = response;
      this.observable.updateSpinnerStatus(false);
    }, error => {
      console.log('%c error while getting all the categories', 'color: yellow', error);
    });
  }

  getAllStores() {
    this.observable.updateSpinnerStatus(true);
    this.dataService.getItems('stores').subscribe((response) => {
      this.handler.reqSuccess(response, 'getting all the stores');
      this.stores = response;
      this.observable.updateSpinnerStatus(false);
    }, error => {
      this.handler.reqError(error, 'getting all the stores');
    });
  }

  addNewStore() {
    const payload = {
      type: 'add',
      from: 'stores',
      data: {
        categories: this.categories
      }
    };

    this.openModel(payload, AddComponent);
  }


  operation(type, item) {
    console.log(`item operation type ${type} and item ${item}`)
    if (type === 'edit') {
      item["categories"] = this.categories;
      const payload = {
        type: 'edit',
        from: 'stores',
        data: item
      };

      this.openModel(payload, AddComponent);
    }

    if (type === 'delete') {

      this.dataService.deleteImage(item.imageUrl)
        .then((response) => {
          this.handler.reqSuccess(response, 'delete image');
          this.dataService.deleteItem(item._id, 'stores');

        })
        .catch((error) => {
          this.handler.reqError(error, 'delete image');
        })
    }
  }

  openModel(payload, component) {
    this.modalService.openDialog(payload, component, { height: '500', width: '400' }, (callback) => {
      console.log('response from the add response', callback);
      if (callback === true) {
        this.getAllStores();
      }
    });
  }

  goToStoresProducts(store) {
    console.log('store', store);
    this.router.navigate([`store/${store._id}`]);
  }


  updateStoreStatus(values,store) {
    console.log(values);

    this.dataService.updateStoreOnlineStatus('stores', store._id , values.storeStatus, )
    .then((response) => {
      this.handler.reqSuccess(response, 'Update Store Status');
      this.getAllStores();
    }, error => {
      this.handler.reqError(error, 'Update Store Status');
    })

  }

}
