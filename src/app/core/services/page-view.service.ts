import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PageViewService {

  // CanEdit property, which can be two way binded
  public editModeOnValue:boolean;
  get editModeOn(): boolean{
    return this.editModeOnValue;
  }
  set editModeOn(val: boolean) {
    this.editModeOnValue = val;
  }



  constructor() { }
}
