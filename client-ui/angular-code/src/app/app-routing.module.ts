import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SheetComponent } from './sheet/sheet.component'

const routes: Routes = [
    {
        path: '',
        component: SheetComponent
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
