import {
  Injectable
} from '@angular/core';
import Sheet from '../../models/sheet';
import BaseIndexCard from '../../models/base-index-card';
import * as availableFileTypesImport from '../../../assets/json/available_file_types.json';
import * as pythonSheetFileImport from '../../../assets/default/python/data.json';
import * as javascriptSheetFileImport from '../../../assets/default/javascript/data.json';
const data = {
    python: pythonSheetFileImport['default'],
    javascript: javascriptSheetFileImport['default']
}
import { BehaviorSubject } from 'rxjs';

const dataTemplate = {
    "defaultFileType": "",
    "dateCreated": "5/10/2018",
    "dateUpdated": "5/10/2018",
    "leftIndexCards": [
    ],
    "rightIndexCards": [
    ]
}

@Injectable({
  providedIn: 'root'
})
export class SheetService {
    // -------------------------------------------------------------------------
    // Attributes
    // -------------------------------------------------------------------------

    // The following variable is a flag for when the page is in Edit mode.
    // With Edit Mode, one can rearrange, delete and edit index cards.
    // This property is two way bindable and initially set to False
    private editModeOnValue: boolean = true;
    public $editModeOn: BehaviorSubject<boolean> = new BehaviorSubject(this.editModeOnValue);
    get editModeOn(): boolean{
        return this.editModeOnValue;
    }
    set editModeOn(val: boolean) {
        this.editModeOnValue = val;
        this.$editModeOn.next(this.editModeOnValue);
    }


    // The following variable is flag that tells whether or not the Sheet Menu
    // on the left side should be open or not.
    private showSheetMenuValue:boolean = true;
    get showSheetMenu(): boolean {
        return this.showSheetMenuValue;
    }
    set showSheetMenu(val: boolean) {
        this.showSheetMenuValue = val;
    }

    // The following string is the current Search filter set in the Header
    private searchFilterValue:string = '';
    get searchFilter(): string {
        return this.searchFilterValue;
    }
    set searchFilter(val: string) {
        this.searchFilterValue = val;
    }

    public readonly availableFileTypes: string[] = availableFileTypesImport['default']; // All available file types for ACE
    public availableSheets: string[] = ['python', 'javascript']; // List of sheets available to switch between
    public currentSheetName: string = 'Python'; // Value of the currently active sheet on the page
    public currentSheetValue: Sheet = null; // Sheet Object of currently active sheet
    public currentSheetIsDirty: boolean = false; // Tells if unSaved Changes have been made


    // -------------------------------------------------------------------------
    // Methods
    // -------------------------------------------------------------------------
    openSheetMenu():void {
        this.showSheetMenuValue = !this.showSheetMenuValue;
    }

    changeCurrentSheet(sheetName: string) {
        this.currentSheetName = sheetName;
        const rawSheetJson = data[sheetName];
        const newSheet = new Sheet();
        newSheet.defaultFileType = rawSheetJson.defaultFileType;
        newSheet.dateCreated = new Date(rawSheetJson.dateCreated);
        newSheet.dateUpdated = new Date(rawSheetJson.dateUpdated);
        newSheet.leftIndexCards = rawSheetJson.leftIndexCards.map((rawIndexCard: any) => {
            const newIndexcard = new BaseIndexCard();
            newIndexcard.indexCardType = rawIndexCard.indexCardType;
            newIndexcard.indexCardTitle = rawIndexCard.indexCardTitle;
            newIndexcard.fileType = rawIndexCard.fileType;
            newIndexcard.fileContent = rawIndexCard.fileContent;
            newIndexcard.dateCreated = rawIndexCard.dateCreated;
            newIndexcard.dateUpdated = rawIndexCard.dateUpdated;
            return newIndexcard;
        });
        newSheet.rightIndexCards = rawSheetJson.rightIndexCards.map((rawIndexCard: any) => {
            const newIndexcard = new BaseIndexCard();
            newIndexcard.indexCardType = rawIndexCard.indexCardType;
            newIndexcard.indexCardTitle = rawIndexCard.indexCardTitle;
            newIndexcard.fileType = rawIndexCard.fileType;
            newIndexcard.fileContent = rawIndexCard.fileContent;
            newIndexcard.dateCreated = new Date(rawIndexCard.dateCreated);
            newIndexcard.dateUpdated = new Date(rawIndexCard.dateUpdated);
            return newIndexcard;
        });
        this.currentSheetValue = newSheet;
    }

    createNewSheet(sheetName: string, defaultFileType: string) {
        const newData = JSON.parse(JSON.stringify(dataTemplate));
        newData.defaultFileType = defaultFileType;
        data[sheetName] = newData;
        this.availableSheets.push(sheetName);
        this.changeCurrentSheet(sheetName);
    }

    constructor() {
        this.changeCurrentSheet('python');
    }
}
