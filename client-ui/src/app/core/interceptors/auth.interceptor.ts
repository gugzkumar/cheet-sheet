import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";

import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(public authService: AuthService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const accessToken = this.authService.getCurrentAccessToken();
        if (accessToken) {
            const clonedReq = req.clone({
              headers: req.headers.set("Authorization", `Bearer ${accessToken}`)
            });
            return next.handle(clonedReq);
        }
        return next.handle(req);
    }
}
