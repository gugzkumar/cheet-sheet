import {
  Injectable
} from '@angular/core';
import * as languages from '../../../assets/json/languages.json';

@Injectable({
  providedIn: 'root'
})
export class PageViewService {

  // CanEdit property, which can be two way binded
  private editModeOnValue:boolean;
  get editModeOn(): boolean{
    return this.editModeOnValue;
  }
  set editModeOn(val: boolean) {
    this.editModeOnValue = val;
    // console.log(this.document.body);
  }

  // CanEdit property, which can be two way binded
  private showLanguageMenuValue:boolean = true;
  get showLanguageMenu(): boolean {
    return this.showLanguageMenuValue;
  }
  set showLanguageMenu(val: boolean) {
    this.showLanguageMenuValue = val;
  }

  openLanguagesMenu():void {
    this.showLanguageMenuValue = !this.showLanguageMenuValue;
  }


  constructor() { }
}
