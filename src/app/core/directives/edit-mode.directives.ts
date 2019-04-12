import {
  Directive,
  TemplateRef,
  ViewContainerRef,
  ElementRef,
  Renderer2
} from '@angular/core';
import { SheetService } from '../services/sheet.service';


@Directive({
  selector: '[ifEditMode]'
})
export class IfEditModeDirective {

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private sheetService: SheetService

  ) {
    this.sheetService.$editModeOn.subscribe((isEditMode) => {
      if(isEditMode) {
        this.viewContainerRef.clear();
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainerRef.clear();
      }
    })
  }

}

@Directive({
  selector: '[ifViewMode]'
})
export class IfViewModeDirective {

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private sheetService: SheetService
  ) {
    this.sheetService.$editModeOn.subscribe((isEditMode) => {
      if(!isEditMode) {
        this.viewContainerRef.clear();
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainerRef.clear();
      }
    })
  }

}

@Directive({
  selector: '[addClassOnEditMode]'
})
export class AddClassOnEditModeDirective {

  constructor(
    private renderer: Renderer2,
    private hostElement: ElementRef,
    private sheetService: SheetService
  ) {
    this.sheetService.$editModeOn.subscribe((isEditMode) => {
      if(isEditMode) {
        this.renderer.addClass(this.hostElement.nativeElement, 'edit-mode');
      } else {
        this.renderer.removeClass(this.hostElement.nativeElement, 'edit-mode');
      }
    })
  }

}
