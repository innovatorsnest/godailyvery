import { ErrorHandlingService } from './../../services/req-handling.service';
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
  tiles: any;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private observable: ObservableService,
    private handler: ErrorHandlingService,
  ) {

  }

  ngOnInit() {
    this.storeId = this.route.snapshot.paramMap.get('storeId');
    console.log('getting the store id', this.storeId);
    this.gettingSpecificStore();
  }

  gettingSpecificStore() {
    this.dataService.getSpecificStore('stores', this.storeId)
      .subscribe((response) => {
        this.tiles = response[0]['tiles'];
        this.handler.reqSuccess(response, 'Specific Store');
      }, error => {
        this.handler.reqError(error, 'Error ');
      });
  }







}
