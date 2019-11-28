import {
  Injectable
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import Sheet from '../../models/sheet';
import BaseIndexCard from '../../models/base-index-card';
import { Observable, BehaviorSubject } from 'rxjs';
import * as availableFileTypesImport from '../../../assets/json/available_file_types.json';
const dataTemplate = {
    "defaultFileType": "python",
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

    constructor(
        private http: HttpClient
    ) {}

    // The following variable is a flag for when the page is in Edit mode.
    // With Edit Mode, one can rearrange, delete and edit index cards.
    // This property is two way bindable and initially set to False
    private editModeOnValue: boolean = false;
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
    private showSheetMenuValue:boolean = false;
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
    public availableSheets: string[]; // List of sheets available to switch between
    public currentSheetName: string = 'Python'; // Value of the currently active sheet on the page
    public currentSheetValue: Sheet = null; // Sheet Object of currently active sheet
    public currentSheetIsDirty: boolean = false; // Tells if unSaved Changes have been made
    public disableSave = false;

    /**
     * Toggles flag to open and close the Side Nav that allows users to switch between sheets.
     */
    toggleSheetMenu(): void {
        this.showSheetMenuValue = !this.showSheetMenuValue;
    }

    /**
     * Sends a request to the API, to create a new Sheet.
     * @param sheetName - Name of new sheet to create
     * @param defaultFileType - Default file type of sheet's index cards
     * @returns an Observable to the http request
     */
    createSheet(sheetName: string, defaultFileType: string): Observable<any> {
        const createSheetRequest = this.http.post(`${environment.apiUrl}/sheet`,
        {
            'sheetName': sheetName,
            'defaultFileType': defaultFileType
        });
        createSheetRequest.subscribe();
        return createSheetRequest;
    }

    /**
     * Sends a request to the API, to create a new Sheet.
     *
     * @param sheetName - Name of sheet to delete
     * @returns an Observable to the http request
     */
    deleteSheet(sheetName: string): Observable<any> {
        const deleteSheetRequest = this.http.delete(
            `${environment.apiUrl}/sheet/${sheetName}`
        );
        deleteSheetRequest.subscribe();
        return deleteSheetRequest;
    }

    /**
     * Sends a request to the api to get all available sheets then saves it to
     * availableSheets.
     *
     * @returns and Observable to the http request
     */
    loadSheetMenu(): Observable<any> {
        const getAllSheetNames = this.http.get(`${environment.apiUrl}/sheet`);
        getAllSheetNames.subscribe((responseBody) => {
            this.availableSheets = responseBody['result']['sheetNames'];
            return this.availableSheets;
        }, () => {});
        return getAllSheetNames;
    }

    /**
     * Sends a request to the get the JsonData of a Sheet based on the User's data.
     * If the request comes successfully back, we navigate to the new Sheet and
     * load the sheet's index cards.
     *
     * @param sheetName - Name of sheet to select
     * @returns and Observable to the http request
     */
    setSelectedSheet(sheetName: string): Observable<any> {
        const getSheetData = this.http.get(`${environment.apiUrl}/sheet/${sheetName}`);
        getSheetData.subscribe((responseBody) => {
            const rawSheetJson = responseBody['result']['sheetData'];
            const sheet = this.parseSheet(rawSheetJson);
            this.currentSheetName = sheetName;
            this.currentSheetValue = sheet;
            return this.currentSheetValue;
        }, () => {});
        return getSheetData;
    }

    /**
     * Sends a request to the save the current sheet and its index cards
     *
     * @returns and Observable to the http request
     */
    saveCurrentSheet(): Observable<any> {
        const body = {
            'sheetName': this.currentSheetName,
            'sheetData': {
            }
        }
        body['sheetData']['defaultFileType'] = this.currentSheetValue.defaultFileType;
        body['sheetData']['defaultFileType'] = this.currentSheetValue.defaultFileType;
        body['sheetData']['leftIndexCards'] = this.currentSheetValue.leftIndexCards.map(
            (card) => {
                return {
                    "indexCardType": "BaseIndexCard",
                    "indexCardTitle": card.indexCardTitle,
                    "fileType": card.fileType,
                    "fileContent": card.fileContent
                }
            }
        );
        body['sheetData']['rightIndexCards'] = this.currentSheetValue.rightIndexCards.map(
            (card) => {
                return {
                    "indexCardType": "BaseIndexCard",
                    "indexCardTitle": card.indexCardTitle,
                    "fileType": card.fileType,
                    "fileContent": card.fileContent
                }
            }
        );
        const saveSheetRequest = this.http.put(
          `${environment.apiUrl}/sheet/${this.currentSheetName}`,
          body
        )
        saveSheetRequest.subscribe(() => {
            this.currentSheetValue.isDirty = false;
        }, () => {});
        return saveSheetRequest;
    }


    /**
     * Create a brand new index card for the current sheet
     *
     * //WARNING: -This only creates on new Index in the user's browser session
     *            -it doesn't doesn't save it.
     */
    createNewBaseIndexCard(): void {
        let arrayToAdd = null;
        if (
            this.currentSheetValue.leftIndexCards.length <=
            this.currentSheetValue.rightIndexCards.length
        ){
            arrayToAdd = this.currentSheetValue.leftIndexCards;
        } else {
            arrayToAdd = this.currentSheetValue.rightIndexCards;
        }
        const indexCard = new BaseIndexCard();
        indexCard.indexCardType = 'BaseIndexCard';
        indexCard.indexCardTitle = 'New Index Card';
        indexCard.fileType = this.currentSheetValue.defaultFileType;
        indexCard.fileContent = '"Change my title and code by clicking EDIT"';
        indexCard.dateCreated = new Date();
        indexCard.dateUpdated = new Date();
        this.currentSheetValue.isDirty = true;
        arrayToAdd.push(indexCard);
    }


    private parseSheet(rawSheetJson: any): Sheet {
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
        return newSheet;
    }
}
