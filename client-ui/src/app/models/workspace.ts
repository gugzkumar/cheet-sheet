export enum WorkspaceIcon { Personal ='person_outline', Public='public', Team='people_outline'};
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
    public displayColorLight: WorkspaceColor;
    public displayColorDark: WorkspaceColor;

    constructor() {
    }

}
