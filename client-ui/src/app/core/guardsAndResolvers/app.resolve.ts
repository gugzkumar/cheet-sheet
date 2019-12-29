import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SheetService } from '../services/sheet.service';
import { WorkspaceService } from '../services/workspace.service';
import { mergeMap } from 'rxjs/operators';

@Injectable()
export class AppResolver implements Resolve<any> {

    constructor(
        private authService: AuthService,
        private sheetService: SheetService,
        private workspaceService: WorkspaceService,
        private router: Router
    ) {
    }

    resolve(route: ActivatedRouteSnapshot) {
        // Initialize Auth
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

        // Load Workspaces
        if (!this.workspaceService.availableWorkspaces)
            this.workspaceService.loadWorkspaces();
        // Set Workspace
        if (this.authService.isLoggedIn) {
            const requestedWorkspaceName = route.queryParams.workspace;
            const availableWorkspaces = this.workspaceService.availableWorkspaces;
            if (!requestedWorkspaceName ) {
                console.log('Test', requestedWorkspaceName);
                return this.router.navigate(['/'], {
                    queryParams: {
                        workspace: availableWorkspaces[0].name
                    },
                    queryParamsHandling: 'merge'
                });
            } else if (availableWorkspaces.findIndex((ws) => ws.name === requestedWorkspaceName) < 0) {
                return this.router.navigate(['/'], {
                    queryParams: {
                        workspace: availableWorkspaces[0].name
                    },
                    queryParamsHandling: 'merge'
                });
            } else {
                this.workspaceService.setWorkspace(requestedWorkspaceName);
            }
        }

        // Load and Set Sheet
        return this.sheetService.loadSheetMenu().pipe(
            mergeMap(responseBody => {
                const sheets = responseBody['result']['sheetNames'];
                // If no sheets available
                if(sheets.length < 1) return [];

                // If requestedSheet is in list use that, otherwise use the first sheet in the list
                const requestedSheet = route.queryParams.sheet;
                if (sheets.indexOf(requestedSheet) < 0)
                    return this.sheetService.setSelectedSheet(sheets[0]);
                else
                    return this.sheetService.setSelectedSheet(requestedSheet);
            })
        );
    }
}
