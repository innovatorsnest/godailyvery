import { ErrorHandlingService } from './../../services/req-handling.service';
import { UploadService } from './../../services/upload.service';
import { DataService } from './../../services/data.service';
import { ModalService } from './../../services/modal.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddComponent } from 'src/app/modals/add/add.component';
import { AngularFireStorage } from '@angular/fire/storage';


@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.scss']
})
export class StoresComponent implements OnInit {

  stores :any;

  constructor(
    private modalService: ModalService,
    private dataService: DataService,
    private storage: AngularFireStorage,
    private uploadService: UploadService,
    private handler: ErrorHandlingService,
  ) {

  }

  allCategories: any[];

  ngOnInit() {
    this.getAllStores();
  }


  getAllStores() {
    this.dataService.getItems('stores').subscribe((response) => {
      this.handler.reqSuccess(response,'getting all the stores');
      this.stores = response;
    }, error => {
      this.handler.reqError(error,'getting all the stores');
    });
  }

  addNewStore() {
    const payload = {
      type: 'add',
      from: 'stores',
      data: {}
    };

    this.openModel(payload, AddComponent);
  }


  operation(type, item) {
    console.log(`item operation type ${type} and item ${item}`)
    if (type === 'edit') {
      const payload = {
        type: 'edit',
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
    this.modalService.openDialog(payload, component, (callback) => {
      console.log('response from the add response', callback);
      if (callback === true) {
        this.getAllStores();
      }
    });
  }


}
