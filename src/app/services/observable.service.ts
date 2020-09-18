
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ObservableService {

  // status spinner toggle
  private spinnerStatus = new BehaviorSubject(false);
  spinnerStatusObservables = this.spinnerStatus.asObservable();


  updateSpinnerStatus(value) {
    this.spinnerStatus.next(value);
  }

  constructor() { }


}
