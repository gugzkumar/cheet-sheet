import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthResolver implements Resolve<any> {
    constructor(private authService: AuthService) { }

    resolve(route: ActivatedRouteSnapshot) {
        const fragment: string = route.fragment;
        let authRouterParams = null;
        if (fragment) {
            authRouterParams = {}
            fragment.split('&').map( str => {
                const key = str.split('=')[0];
                const value = str.split('=')[1];
                authRouterParams[key] = value;
            });
        }
        this.authService.handleAuthentication(authRouterParams);
    }
}
