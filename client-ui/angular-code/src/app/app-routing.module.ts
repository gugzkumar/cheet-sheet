import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SheetComponent } from './sheet/sheet.component';
import { AuthResolver } from './core/guardsAndResolvers/auth.resolve';

const routes: Routes = [
    {
        path: '',
        component: SheetComponent,
        resolve: {
            auth: AuthResolver
        }
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
