import { Component, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AuthService } from '../core/services/auth.service';

@Component({
    selector: 'app-auth-callback',
    templateUrl: './auth-callback.component.html',
    styleUrls: ['./auth-callback.component.scss']
})
export class AuthCallbackComponent implements OnInit {
    constructor(
        private authService: AuthService,
        private snackBar: MatSnackBar,
        private router: Router
    ) {
    }

    generateSnackbarMessage(message:string, options) {
        // Using the promise is a workaround to snackbar behavior https://github.com/angular/components/issues/11357
        Promise.resolve().then(() => {
            this.snackBar.open(message, '', options);
        });
    }

    ngOnInit() {
        if (this.router.url === '/logout')
        {
            this.generateSnackbarMessage(
                `You have successfully logged out`,
                { duration: 2000 }
            );

        } else {
            if (this.authService.isLoggedIn) {
                this.generateSnackbarMessage(
                    `Welcome ${this.authService.username}!`,
                    { duration: 2000, panelClass: ['green-snackbar'] }
                );
            } else {
                this.generateSnackbarMessage(
                    `Welcome ${this.authService.username}!`,
                    { duration: 3000, panelClass: ['red-snackbar'] }
                );
            }
        }
        this.router.navigate(['/']);
    }

}
