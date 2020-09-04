import { ModalService } from './../../services/modal.service';
import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { AddComponent } from 'src/app/modals/add/add.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  constructor(
    private modalService: ModalService
  ) { }

  allCategories: any[];

  ngOnInit() {
  }

  addNewCategory() {
    const payload = {
      type: 'add',
      data: []
    };

    this.modalService.addCategory(payload, AddComponent,(response) => {
      console.log('response from the add response', response);
    });
  }


}
