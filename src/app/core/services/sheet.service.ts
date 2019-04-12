import {
  Injectable,
  OnInit,
  OnChanges
} from '@angular/core';
import Sheet from '../../models/sheet.interface';
import BaseIndexCard from '../../models/base-index-card';
import * as available_file_types from '../../../assets/json/available_file_types.json';
import * as pythonSheetFileImport from '../../../assets/default/python/data.json';
import * as javascriptSheetFileImport from '../../../assets/default/javascript/data.json';
const data = {
    python: pythonSheetFileImport['default'],
    javascript: javascriptSheetFileImport['default']
}


import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SheetService {
    // -------------------------------------------------------------------------
    // Attributes
    // -------------------------------------------------------------------------

    // The following variable is a flag for when the page is in Edit mode.
    // With Edit Mode, one can rearrange, delete and edit index cards.
    // This property is two way binded and initially set to False
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

    // List of sheets available to switch between
    public availableSheets: string[] = ['python', 'javascript'];

    // Value of the currently selected sheet on the page
    public currentSheetName: string = 'Python';
    public currentSheetValue: Sheet = null;
    public currentSheetIsDirty: boolean = false;
    // get currentSheetName(): string{
    //     return this.currentSheetNameValue;
    // }
    // set currentSheetName(val: string) {
    //     this.currentSheetNameValue = val;
    // }


    // -------------------------------------------------------------------------
    // Methods
    // -------------------------------------------------------------------------
    openSheetMenu():void {
        this.showSheetMenuValue = !this.showSheetMenuValue;
    }

    changeToNewSheet(sheetName: string) {
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
        console.log(newSheet);
        this.currentSheetValue = newSheet;
    }

    constructor() {
        this.changeToNewSheet('python');
    }
}
