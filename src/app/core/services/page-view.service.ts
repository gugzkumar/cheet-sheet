import {
  Injectable
} from '@angular/core';
import * as languages from '../../../assets/json/languages.json';

import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PageViewService {

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


  // The following variable is flag that tells whether or not the Language Menu
  // on the left side should be open or not.
  private showLanguageMenuValue:boolean = true;
  get showLanguageMenu(): boolean {
    return this.showLanguageMenuValue;
  }
  set showLanguageMenu(val: boolean) {
    this.showLanguageMenuValue = val;
  }

  // List of languages available to switch between
  public languages: string[] = [
    'Python', 'JavaScript', 'Docker', "Svg","Csp",
      "Swift","Css","Tcl","Curly"
  ];

  // Value of the currently selected language on the page
  private currentLanguageValue: string = 'Python';
  get currentLanguage(): string{
    return this.currentLanguageValue;
  }
  set currentLanguage(val: string) {
    this.currentLanguageValue = val;
  }

  // -------------------------------------------------------------------------
  // Methods
  // -------------------------------------------------------------------------

  openLanguagesMenu():void {
    this.showLanguageMenuValue = !this.showLanguageMenuValue;
  }

  changeLanguage(language: string) {
    this.currentLanguage = language;

  }


  constructor() { }
}
