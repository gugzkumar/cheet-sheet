import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthCallbackComponent } from './auth-callback/auth-callback.component';
import { SheetComponent } from './sheet/sheet.component';
import { AuthResolver } from './core/guardsAndResolvers/auth.resolve';
import { AppResolver } from './core/guardsAndResolvers/app.resolve';

const routes: Routes = [
    {
        path: '',
        component: SheetComponent,
        resolve: {
            sheet: AppResolver
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
    },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
