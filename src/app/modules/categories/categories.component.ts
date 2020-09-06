import { DataService } from './../../services/data.service';
import { ModalService } from './../../services/modal.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddComponent } from 'src/app/modals/add/add.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  categories: unknown[];

  constructor(
    private modalService: ModalService,
    private dataService: DataService,

  ) {

  }

  allCategories: any[];

  ngOnInit() {
    this.getAllCategories();
  }


  getAllCategories() {
    this.dataService.getItems('categories').subscribe((response) => {
      console.log('%c response from getting the data service', 'color: yellow', response);
      this.categories = response;
    }, error => {
      console.log('%c error while getting all the categories', 'color: yellow', error);
    });
  }

  addNewCategory() {
    const payload = {
      type: 'add',
      data: {}
    };

    this.openModel(payload, AddComponent);

  }


  operation(type, item) {
    if (type === 'edit') {
      const payload = {
        type: 'edit',
        data: item
      };

      this.openModel(payload, AddComponent);
    }

    if (type === 'delete') {
      this.dataService.deleteItem(item._id, 'categories')
        .then((response) => {
          console.log('%c response while removing item', 'color: yellow', response);
        }, (error) => {
          console.log('%c error while removing item', 'color: yellow', error);
        });
    }
  }

  openModel(payload, component) {
    this.modalService.openDialog(payload, component, (callback) => {
      console.log('response from the add response', callback);
      if (callback === true) {
        this.getAllCategories();
      }
    });
  }


}
