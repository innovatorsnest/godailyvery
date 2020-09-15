import { AngularFireDatabaseModule } from '@angular/fire/database';
import { CategoriesComponent } from './modules/categories/categories.component';
import { SidenavComponent } from './modules/shared/sidenav/sidenav.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LayoutModule } from '@angular/cdk/layout';
import { MaterialModule } from './helper/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { AddComponent } from './modals/add/add.component';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { StoresComponent } from './modules/stores/stores.component';
import { AngularFireStorageModule , BUCKET } from '@angular/fire/storage';

const CONFIG = {
  apiKey: "AIzaSyCLqTYsblJGrCy88zcwMEgqo0gH2ipk2BI",
  authDomain: "dailydelivery-38619.firebaseapp.com",
  databaseURL: "https://dailydelivery-38619.firebaseio.com",
  projectId: "dailydelivery-38619",
  storageBucket: "dailydelivery-38619.appspot.com",
  messagingSenderId: "539883691020",
  appId: "1:539883691020:web:cffecd62c81a35b709e229",
  measurementId: "G-FTGQ91LRD2",
}

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    CategoriesComponent,
    AddComponent,
    StoresComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(CONFIG),
    AngularFireStorageModule,
    AngularFireDatabaseModule,

  ],
  entryComponents: [AddComponent],
  providers: [
    { provide: BUCKET, useValue: 'gs://dailydelivery-38619.appspot.com' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
