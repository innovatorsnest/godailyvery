import { ObservableService } from './services/observable.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  events: string[] = [];
  opened: boolean;

  spinner: boolean;

  shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));

  constructor(
    private observable: ObservableService,
    private cdRef : ChangeDetectorRef
  ) {

  }

  ngOnInit() {
    this.observable.spinnerStatusObservables.subscribe((status) => {
      this.spinner = status;
    })
  }


  ngAfterViewChecked() {

      this.cdRef.detectChanges();

  }

}
