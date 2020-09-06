
import { Injectable, Injector, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(
    public dialog: MatDialog,
  ) { }


  openDialog(data, component, callback) {
    const dialogRef = this.dialog.open(component, {
      width: '400px',
      height: '400px',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result)
      callback(result);
    });
  }
}
