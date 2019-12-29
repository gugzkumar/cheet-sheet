import { Injectable } from '@angular/core';
import Workspace, { WorkspaceColor, WorkspaceIcon } from '../../models/workspace';
import { ActivatedRoute } from '@angular/router';
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

    constructor(
        private route: ActivatedRoute,
        private authService: AuthService,
        private sheetService: SheetService
    ) {
    }

    initWorkspaceRouterListener() {
        this.route.queryParams.subscribe(queryParams => {
            console.log('1');
            const sheetService = this.sheetService;
            if (
                sheetService.availableSheets &&
                queryParams.sheet &&
                sheetService.currentSheetName!=queryParams.sheet
            ) {
                sheetService.setSelectedSheet(queryParams.sheet);
            }

            if (this.selectedWorkspace && this.selectedWorkspace.name == queryParams.workspace) return;
            const requestedWorkspace = this.availableWorkspaces.find(
                ws => ws.name === queryParams.workspace
            );
            this.selectedWorkspace = requestedWorkspace;
            console.log('HERE');
            sheetService.loadSheetMenu().pipe(mergeMap((responseBody) => {
                console.log('WHY');
                const sheets = responseBody['result']['sheetNames'];
                // If no sheets available
                if(sheets.length < 1) return [];
                return sheetService.setSelectedSheet(sheets[0]);
            })).subscribe();
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
