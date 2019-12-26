import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
const COGNITO_PARAMS = environment.cognitoParams;
const ACCESS_TOKEN = 'access_token';
const ID_TOKEN = 'id_token';
const EXPIRES_AT = 'expires_at';
const TOKEN = 'token';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private jwtHelper = new JwtHelperService();
    private isLoggedInValue: boolean;
    public $isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject(this.isLoggedInValue);

    get isLoggedIn(): boolean{
        return this.isLoggedInValue;
    }
    set isLoggedIn(val: boolean) {
        this.isLoggedInValue = val;
        this.$isLoggedIn.next(this.isLoggedInValue);
    }

    public username: string;

    login() {
        this.document.location.href = (
            COGNITO_PARAMS.cognitoLoginUrl + '?' +
            `response_type=${COGNITO_PARAMS.cognitoResponseType}&` +
            `client_id=${COGNITO_PARAMS.cognitoClientId}&` +
            `redirect_uri=${COGNITO_PARAMS.cognitoRedirectUri}&` +
            `scope=${COGNITO_PARAMS.cognitoScope}`
        );
    }

    logout() {
        this.clearLocalStorage();
        this.document.location.href = (
            COGNITO_PARAMS.cognitoLogoutUrl + '?' +
            `client_id=${COGNITO_PARAMS.cognitoClientId}&` +
            `logout_uri=${COGNITO_PARAMS.cognitoLogoutRedirectUri}`
        );
    }

    clearLocalStorage() {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(ID_TOKEN);
        localStorage.removeItem(EXPIRES_AT);
        localStorage.removeItem(TOKEN);
    }

    getCurrentIdToken() {
        return localStorage.getItem(ID_TOKEN);
    }

    getCurrentAccessToken() {
        return localStorage.getItem(ACCESS_TOKEN);
    }

    handleAuthentication(authRouterParams) {
        if (authRouterParams) {
            localStorage.setItem(ACCESS_TOKEN, authRouterParams['access_token']);
            localStorage.setItem(ID_TOKEN, authRouterParams['id_token']);
            localStorage.setItem(
                EXPIRES_AT, this.jwtHelper.decodeToken(authRouterParams.access_token).exp
            );
            const token = {
                ACCESS_TOKEN: authRouterParams.accessToken,
                ID_TOKEN: authRouterParams.idToken,
                EXPIRES_AT: authRouterParams
            };
            localStorage.setItem(TOKEN, JSON.stringify(token));
        }

        const accessToken = localStorage.getItem(ACCESS_TOKEN);
        if (this.jwtHelper.isTokenExpired(accessToken)) {
            this.clearLocalStorage();
            this.isLoggedIn = false;
        } else {
            this.isLoggedIn = true;
            this.username = this.jwtHelper.decodeToken(accessToken).username;
        }
    }

    constructor(@Inject(DOCUMENT) private document: any) { }
}
