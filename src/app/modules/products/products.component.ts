import { AddComponent } from './../../modals/add/add.component';
import { ObservableService } from './../../services/observable.service';
import { ErrorHandlingService } from './../../services/req-handling.service';
import { UploadService } from './../../services/upload.service';
import { DataService } from './../../services/data.service';
import { ModalService } from './../../services/modal.service';
import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AngularFireStorage } from '@angular/fire/storage';
declare var $: any;

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: any;

  @Input() tiles;

  @Input() key;
  store: unknown;

  constructor(
    private modalService: ModalService,
    private dataService: DataService,
    private storage: AngularFireStorage,
    private uploadService: UploadService,
    private handler: ErrorHandlingService,
    private observable: ObservableService,
    private errorHandling: ErrorHandlingService,
  ) {
  }

  allProducts: any[];

  ngOnInit() {
    this.getAllProductsOfStores();
  }



  addCategories() {
    const payload = {
      type: 'add-tiles',
      from: 'add-tiles',
      data: this.store,
      key: this.key
    };
    this.openModel(payload, AddComponent, '400', '500');
  }

  getAllProductsOfStores() {
    this.observable.updateSpinnerStatus(true);

    console.log('key', this.key);
    this.dataService.getProductsOfStore('stores', this.key)
      .subscribe((response) => {
        console.log('%c response from getting the data service', 'color: yellow', response);
        this.store = response[0];
        this.products = response[0]["products"];
        this.observable.updateSpinnerStatus(false);

      }, error => {
        console.log('%c error while getting all the products', 'color: yellow', error);
      });
  }

  addNewProduct() {
    const payload = {
      type: 'add',
      from: 'products',
      data: this.products || [],
      key: this.key,
      tiles: this.tiles,
      store: this.store
    };

    this.openModel(payload, AddComponent, '400', '400');
  }


  operation(type, item, index) {
    console.log('item operation type', type);
    console.log('item operation', item);
    this.observable.updateSpinnerStatus(true);

    if (type === 'edit') {
      item["products"] = this.products;

      const payload = {
        type: 'edit',
        from: 'products',
        data: item,
        products: this.products,
        index: index,
        tiles: this.tiles,
        key: this.key,
        store: this.store
      };

      this.openModel(payload, AddComponent, '500', '400');
    }

    if (type === 'delete') {
      if (item.imageUrl === '') {
        this.removeProductFromProducts(index);
      } else {
        this.dataService.deleteImage(item.imageUrl)
          .then((response) => {
            this.handler.reqSuccess(response, 'delete image');
            this.removeProductFromProducts(index);
          })
          .catch((error) => {
            this.handler.reqError(error, 'delete image');
          })
      }

    }
  }

  removeProductFromProducts(index) {
    this.products.splice(index, 1);
    console.log('remaining products after splicing', this.products);
    this.dataService.updateProductsOfStore('stores', this.key, this.products)
      .subscribe((response) => {
        this.errorHandling.reqSuccess(response, 'Remove Product');
      }, error => {
        this.errorHandling.reqError(error, 'Error Product');
      });
  }


  openModel(payload, component, h, w) {
    this.modalService.openDialog(payload, component, { height: h, width: w }, (callback) => {
      console.log('response from the add response', callback);
      if (callback === true) {
        this.getAllProductsOfStores();
      }
    });
  }

}
