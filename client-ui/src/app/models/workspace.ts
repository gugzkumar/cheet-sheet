export enum WorkspaceIcon { Personal ='person_outline', Public='public', Team='people_outline'};
export enum WorkspaceIconClass {
    Personal ='workspace-icon-person mat-icon notranslate material-icons mat-icon-no-color',
    Public='workspace-icon-public mat-icon notranslate material-icons mat-icon-no-color',
    Team='workspace-icon-team mat-icon notranslate material-icons mat-icon-no-color'
};
export enum WorkspaceColor {
    Personal ='none',
    PublicDark='#1E88E5',
    TeamDark='#FFAB00',
    PublicLight='#BBDEFB',
    TeamLight='#FFD54F'
};

export default class Workspace {

    public name: string;
    public displayIcon: WorkspaceIcon;
    public displayIconClass: WorkspaceIconClass;

    constructor() {
    }

}
