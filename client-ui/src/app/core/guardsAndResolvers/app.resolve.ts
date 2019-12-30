import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SheetService } from '../services/sheet.service';
import { WorkspaceService } from '../services/workspace.service';
import { Observable } from 'rxjs';
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


        const requestedSheetName = route.queryParams.sheet;
        const requestedWorkspaceName = route.queryParams.workspace;


        // Load sheet
        if (this.sheetService.availableSheets != undefined && this.sheetService.availableSheets != null) {
            if ( !requestedSheetName ) {
                this.sheetService.currentSheetValue = null;
                this.sheetService.currentSheetName = null;
                return true;
            } else {
                return this.sheetService.setSelectedSheet(requestedSheetName);
            }
        }

        // Load Workspaces
        if (!this.workspaceService.availableWorkspaces)
            this.workspaceService.loadWorkspaces();
        // Set Workspace
        if (this.authService.isLoggedIn) {
            const availableWorkspaces = this.workspaceService.availableWorkspaces;
            if (!requestedWorkspaceName) {
                return this.router.navigate(['/'], {
                    queryParams: {
                        workspace: availableWorkspaces[0].name,
                        sheet: requestedSheetName
                    }
                });
            } else if (availableWorkspaces.findIndex((ws) => ws.name === requestedWorkspaceName) < 0) {
                return this.router.navigate(['/'], {
                    queryParams: {
                        workspace: availableWorkspaces[0].name,
                        sheet: requestedSheetName
                    }
                });
            } else {
                this.workspaceService.setWorkspace(requestedWorkspaceName);
            }
        }

        // Load and Set Sheet
        return this.sheetService.loadSheetMenu().pipe(
            mergeMap(responseBody => {
                const sheets = responseBody['result']['sheetNames'];
                if(sheets.length < 1) {
                    return this.router.navigate(['/'], {
                        queryParams: {
                            workspace: requestedWorkspaceName,
                            sheet: null
                        },
                        queryParamsHandling: 'merge'
                    });
                }
                if(sheets.indexOf(requestedSheetName) < 0) {
                    return this.router.navigate(['/'], {
                        queryParams: {
                            workspace: requestedWorkspaceName,
                            sheet: sheets[0]
                        },
                    });
                }
                return this.sheetService.setSelectedSheet(requestedSheetName);
            })
        );
    }
}
