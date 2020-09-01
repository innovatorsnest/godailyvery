import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoriesComponent } from './modules/categories/categories.component';


const routes: Routes = [
  {
    path: 'categories',
    component: CategoriesComponent
    // loadChildren: () => import('./modules/categories/categories.module').then(module => {
    //   module.CategoriesModule
    // })
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
