import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthCallbackComponent } from './auth-callback/auth-callback.component';
import { SheetComponent } from './sheet/sheet.component';
import { AuthResolver } from './core/guardsAndResolvers/auth.resolve';
import { SheetResolver } from './core/guardsAndResolvers/sheet.resolve';

const routes: Routes = [
    {
        path: '',
        component: SheetComponent,
        resolve: {
            auth: AuthResolver,
            sheet: SheetResolver
        }
    },
    {
        path: 'login/callback',
        component: AuthCallbackComponent,
        resolve: {
            auth: AuthResolver
        }
    },
    {
        path: 'logout',
        component: AuthCallbackComponent,
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
