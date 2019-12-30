import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

import { AuthService } from '../services/auth.service';
import { WorkspaceService } from '../services/workspace.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        public authService: AuthService,
        public workspaceService: WorkspaceService
    ) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const accessToken = this.authService.getCurrentAccessToken();
        if (accessToken) {
            const clonedReq = req.clone({
              headers: req.headers.set("Authorization", `Bearer ${accessToken}`),
              params: req.params.set('workspace', this.workspaceService.selectedWorkspace.name)
            });
            return next.handle(clonedReq);
        }
        return next.handle(req);
    }
}
