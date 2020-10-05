import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {

  constructor() { }

  reqSuccess(response,type) {
    console.log(`%c response while ${type}`,'color: yellow', response);
  }

  reqError(error, type) {
    console.log(`%c error while ${type}`,'color: yellow', error);

  }
}
