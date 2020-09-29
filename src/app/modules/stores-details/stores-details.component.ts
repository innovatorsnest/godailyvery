import { ObservableService } from './../../services/observable.service';
import { DataService } from './../../services/data.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-stores-details',
  templateUrl: './stores-details.component.html',
  styleUrls: ['./stores-details.component.scss']
})
export class StoresDetailsComponent implements OnInit {
  storeId: string;

  constructor(
    private route: ActivatedRoute,
    private dataService:  DataService,
    private observable:  ObservableService,
  ) {



   }

  ngOnInit() {
    this.storeId = this.route.snapshot.paramMap.get('storeId');
    console.log('getting the store id', this.storeId);
  }




}
