import { ObservableService } from './observable.service';
import { DataService } from './data.service';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(
    private dataService: DataService,
    private observable: ObservableService,
  ) { }


  getAllCategories() {
   return this.dataService.getItems('categories').subscribe((response) => {
      console.log('%c response from getting the data service', 'color: yellow', response);
      let categories = response;
      this.observable.updateSpinnerStatus(false);
      return categories;
    }, error => {
      console.log('%c error while getting all the categories', 'color: yellow', error);
    });
  }
}
