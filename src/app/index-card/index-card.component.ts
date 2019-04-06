import {
  Component,
  ElementRef,
  Input,
  OnInit,
  OnChanges,
  OnDestroy
} from '@angular/core';

import {
  MatSnackBar
} from '@angular/material';

import { AceEditorService } from '../core/services/ace-editor.service';
import BaseIndexCardModel from '../models/base-index-card.model';

@Component({
  selector: 'app-index-card',
  templateUrl: './index-card.component.html',
  styleUrls: ['./index-card.component.scss']
})
export class IndexCardComponent implements OnDestroy, OnInit, OnChanges {
  @Input() indexCardContent: BaseIndexCardModel;
  public enableElevation:boolean = false;

  // Two Way Bindable canEdit property
  public canEditValue:boolean;
  @Input()
  get canEdit(): boolean{
    return this.canEditValue;
  }
  set canEdit(val: boolean) {
    this.canEditValue = val;
  }

  constructor(
    private aceEditorService: AceEditorService,
    private snackBar: MatSnackBar,
    private container: ElementRef) {
      console.log('One')
  }

  ngOnInit() {
    this.container.nativeElement.lastElementChild.lastElementChild.children[2].lastElementChild.id =
      this.indexCardContent.codeSnippetTitle.replace(/\s/gi, '-');
    // console.log(
    //   this.container.nativeElement,
    //   this.container.nativeElement.lastElementChild,
    //   this.container.nativeElement.lastElementChild.lastElementChild,
    //   this.container.nativeElement.lastElementChild.lastElementChild.lastElementChild
    // )
    try {

      this.aceEditorService.setReadOnlyEditor(
        this.indexCardContent.codeSnippetTitle.replace(/\s/gi, '-'),
        this.indexCardContent.codeSnippetFileType,
        this.indexCardContent.codeSnippetText
      );

    }
    catch(e) {
      console.log(e);
    }
  }

  ngOnChanges() {
    this.container.nativeElement.lastElementChild.lastElementChild.children[2].lastElementChild.id =
      this.indexCardContent.codeSnippetTitle.replace(/\s/gi, '-');

    try {
      this.aceEditorService.setReadOnlyEditor(
        this.indexCardContent.codeSnippetTitle.replace(/\s/gi, '-'),
        this.indexCardContent.codeSnippetFileType,
        this.indexCardContent.codeSnippetText
      );

    }
    catch(e) {
      console.log(e);
    }
  }

  ngOnDestroy() {
    // console.log(this.indexCardContent)
  }


  copyToClipBoard() {
    if (this.canEditValue) {
        return;
    }

    let navigatorVariable: any;
    navigatorVariable = window.navigator;
    navigatorVariable.clipboard.writeText(this.indexCardContent.codeSnippetText).then(
      function() {
      },
      function() {
        /* clipboard write Failed */
    });
    this.snackBar.open('Code snippet copied to your clipboard', '', {
        duration: 800,
    });
  }

}
