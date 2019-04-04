import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageViewComponent } from './page-view/page-view.component'

const routes: Routes = [
    {
        path: '',
        component: PageViewComponent
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
