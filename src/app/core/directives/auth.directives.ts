import {
  Directive,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[ifLoggedIn]'
})
export class IfLoggedInDirective {
  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private authService: AuthService

  ) {
    this.authService.$isLoggedIn.subscribe((isLoggedIn) => {
      if(isLoggedIn) {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainerRef.clear();
      }
    })
  }
}

@Directive({
  selector: '[ifLoggedOut]'
})
export class IfLoggedOutDirective {
  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private authService: AuthService

  ) {
    this.authService.$isLoggedIn.subscribe((isLoggedIn) => {
      if(!isLoggedIn) {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainerRef.clear();
      }
    })
  }
}
