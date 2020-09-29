import { ObservableService } from './../../services/observable.service';
import { ErrorHandlingService } from './../../services/req-handling.service';
import { UploadService } from './../../services/upload.service';
import { DataService } from './../../services/data.service';
import { ModalService } from './../../services/modal.service';
import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddComponent } from 'src/app/modals/add/add.component';
import { AngularFireStorage } from '@angular/fire/storage';



@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: any;

  @Input() key;

  constructor(
    private modalService: ModalService,
    private dataService: DataService,
    private storage: AngularFireStorage,
    private uploadService: UploadService,
    private handler: ErrorHandlingService,
    private observable: ObservableService,
  ) {
  }

  allProducts: any[];

  ngOnInit() {
    this.getAllProductsOfStores();
  }


  getAllProductsOfStores() {
    this.observable.updateSpinnerStatus(true);

    console.log('key', this.key);
    this.dataService.getProductsOfStore('stores', this.key)
      .subscribe((response) => {
        console.log('%c response from getting the data service', 'color: yellow', response);
        this.products = response[0]["products"];
        this.observable.updateSpinnerStatus(false);

      }, error => {
        console.log('%c error while getting all the products', 'color: yellow', error);
      });


    // this.dataService.getItems('stores').subscribe((response) => {
    //   console.log('%c response from getting the data service', 'color: yellow', response);
    //   this.products = response;
    //   this.observable.updateSpinnerStatus(false);

    // }, error => {
    //   console.log('%c error while getting all the products', 'color: yellow', error);
    // });
  }

  addNewProduct() {
    const payload = {
      type: 'add',
      from: 'products',
      data: this.products,
      key: this.key
    };

    this.openModel(payload, AddComponent);
  }


  operation(type, item) {
    console.log('item operation type', type);
    console.log('item operation', item);
    this.observable.updateSpinnerStatus(true);

    if (type === 'edit') {
      item["products"] = this.products;
      const payload = {
        type: 'edit',
        from: 'products',
        data: item,
        key: this.key
      };

      this.openModel(payload, AddComponent);
    }

    if (type === 'delete') {
      this.dataService.deleteImage(item.imageUrl)
        .then((response) => {
          this.handler.reqSuccess(response, 'delete image');
          this.dataService.deleteItem(item._id, 'products');

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
        this.getAllProductsOfStores();
      }
    });
  }

}
