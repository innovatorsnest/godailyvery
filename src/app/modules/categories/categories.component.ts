import { ObservableService } from './../../services/observable.service';
import { ErrorHandlingService } from './../../services/req-handling.service';
import { UploadService } from './../../services/upload.service';
import { DataService } from './../../services/data.service';
import { ModalService } from './../../services/modal.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddComponent } from 'src/app/modals/add/add.component';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  categories: any;

  constructor(
    private modalService: ModalService,
    private dataService: DataService,
    private storage: AngularFireStorage,
    private uploadService: UploadService,
    private handler: ErrorHandlingService,
    private observable: ObservableService,
  ) {
    this.getAllCategories();
  }

  allCategories: any[];

  ngOnInit() {

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

  addNewCategory() {
    const payload = {
      type: 'add',
      from: 'categories',
      data: {  },
    };

    this.openModel(payload, AddComponent);
  }


  operation(type, item) {
    console.log('item operation type', type);
    console.log('item operation', item);
    this.observable.updateSpinnerStatus(true);


    if (type === 'edit') {
      item["categories"] = this.categories;
      const payload = {
        type: 'edit',
        from: 'categories',
        data: item
      };

      this.openModel(payload, AddComponent);
    }

    if (type === 'delete') {
      this.dataService.deleteImage(item.imageUrl)
        .then((response) => {
          this.handler.reqSuccess(response, 'delete image');
          this.dataService.deleteItem(item._id, 'categories');

        })
        .catch((error) => {
          this.handler.reqError(error, 'delete image');
        })
    }
  }

  openModel(payload, component) {
    this.modalService.openDialog(payload, component, { height: '400', width: '400' }, (callback) => {
      console.log('response from the add response', callback);
      if (callback === true) {
        this.getAllCategories();
      }
    });
  }

}
