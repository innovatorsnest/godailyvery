import { StoresDetailsComponent } from './modules/stores-details/stores-details.component';
import { StoresComponent } from './modules/stores/stores.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoriesComponent } from './modules/categories/categories.component';
import { ProductsComponent } from './modules/products/products.component';


const routes: Routes = [
  {
    path: 'categories',
    component: CategoriesComponent
  },
  {
    path: 'stores',
    component: StoresComponent
  },
  {
    path: 'products',
    component: ProductsComponent
  },
  {
    path: 'store/:storeId',
    component: StoresDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
