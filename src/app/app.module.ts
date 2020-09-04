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
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireModule } from '@angular/fire';
import {environment} from './../environments/environment';


@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    CategoriesComponent,
    AddComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(environment.FIREBASE_CONFIG)


  ],
  entryComponents: [AddComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
