import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isLoggedInValue: boolean = false;
  public $isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject(this.isLoggedInValue);
  get isLoggedIn(): boolean{
    return this.isLoggedInValue;
  }
  set isLoggedIn(val: boolean) {
    this.isLoggedInValue = val;
    this.$isLoggedIn.next(this.isLoggedInValue);
  }

  login() {
    this.isLoggedIn = true;
  }
  logout() {
    this.isLoggedIn = false;
  }

  constructor() { }
}
