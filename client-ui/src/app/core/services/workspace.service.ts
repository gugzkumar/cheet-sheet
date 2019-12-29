import { Injectable } from '@angular/core';
import Workspace, { WorkspaceColor, WorkspaceIcon } from '../../models/workspace';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { SheetService } from './sheet.service';
import { environment } from '../../../environments/environment';
const ADMIN_USER_GROUP = environment.adminUserGroup;
import { mergeMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class WorkspaceService {

    public availableWorkspaces: Workspace[];
    public selectedWorkspace: Workspace;

    private transitioningToNewWorkspace = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
        private sheetService: SheetService
    ) {
    }

    initWorkspaceRouterListener() {
        const sheetService = this.sheetService;
        this.route.queryParams.subscribe(queryParams => {
            // // Handle switching Workspace Query Params
            if (this.authService.isLoggedIn) {
                if (this.selectedWorkspace && this.selectedWorkspace.name != queryParams.workspace)
                {
                    const requestedWorkspace = this.availableWorkspaces.find(
                        ws => ws.name === queryParams.workspace
                    );
                    this.selectedWorkspace = requestedWorkspace;
                    this.transitioningToNewWorkspace = true;
                    // If workspace is switched we need a new sheet list
                    sheetService.loadSheetMenu().pipe(mergeMap((responseBody) => {
                        const sheets = responseBody['result']['sheetNames'];
                        if(sheets.length < 1) {
                            return this.router.navigate(['/'], {
                                queryParams: {'sheet': null},
                                queryParamsHandling: 'merge'
                            });
                        }

                        if (sheets[0] === sheetService.currentSheetName)
                            return sheetService.setSelectedSheet(queryParams.sheet);

                        return this.router.navigate(['/'], {
                            queryParams: {'sheet': sheets[0]},
                            queryParamsHandling: 'merge'
                        });
                    })).subscribe();
                    return;
                }
            }

            // Handle switching Sheet Query Params
            if ( !queryParams.sheet ) {
                sheetService.currentSheetValue = null;
                sheetService.currentSheetName = null;
            } else if (
                this.transitioningToNewWorkspace ||
                sheetService.currentSheetName!=queryParams.sheet
            ) {
                this.transitioningToNewWorkspace = false;
                sheetService.setSelectedSheet(queryParams.sheet);
            }
        });
    }

    loadWorkspaces() {
        if (!this.authService.isLoggedIn) return;
        this.availableWorkspaces = this.parseGroups(this.authService.groups);
    }

    setWorkspace(workspaceName: string) {
        this.selectedWorkspace = this.availableWorkspaces.find(
            ws => ws.name === workspaceName
        );
    }


    /**
     * Load all available groups
     */
    private parseGroups(groups: string[]): Workspace[] {
        var indexOfAdminGroup = groups.indexOf(ADMIN_USER_GROUP);
        const workspaces: Workspace[] = [];
        // Add the Default Personal Workspace
        workspaces.push({
            name: 'Personal',
            displayIcon: WorkspaceIcon.Personal,
            displayColorDark: WorkspaceColor.Personal,
            displayColorLight: WorkspaceColor.Personal
        });
        // Add the Public Workspace if user belongs to the admin group
        if(indexOfAdminGroup > -1)
            workspaces.push({
                name: 'Public',
                displayIcon: WorkspaceIcon.Public,
                displayColorDark: WorkspaceColor.PublicDark,
                displayColorLight: WorkspaceColor.PublicLight
            });

        // Add Team Workspaces
        groups.map(groupName => {
            if (groupName === ADMIN_USER_GROUP) return;
            workspaces.push({
                name: groupName,
                displayIcon: WorkspaceIcon.Team,
                displayColorDark: WorkspaceColor.TeamDark,
                displayColorLight: WorkspaceColor.TeamLight
            });
        });
        return workspaces;
    }

}
