import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageEditComponent } from './page-edit/page-edit.component'
import { PageViewComponent } from './page-view/page-view.component'

const routes: Routes = [
    {
        path: '',
        component: PageViewComponent
    },
    {
        path: 'edit',
        component: PageEditComponent
    },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
