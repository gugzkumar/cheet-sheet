import {
  Component,
  Input,
  OnInit,
  OnChanges
} from '@angular/core';

import { AceEditorService } from '../core/services/ace-editor.service';
import BaseIndexCardModel from '../models/base-index-card.model';

@Component({
  selector: 'app-index-card',
  templateUrl: './index-card.component.html',
  styleUrls: ['./index-card.component.scss']
})
export class IndexCardComponent implements OnInit, OnChanges {
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


  constructor(private aceEditorService: AceEditorService) {
  }

  ngOnInit() {
    try {

      this.aceEditorService.setReadOnlyEditor(
        this.indexCardContent.uniqueId,
        this.indexCardContent.codeSnippetFileType,
        this.indexCardContent.codeSnippetText
      );

    }
    catch(e) {
      console.log(e);
    }
    // while(true) {
      // try {
      //
      //   this.aceEditorService.setReadOnlyEditor(
      //     this.id,
      //     this.indexCardContent.codeSnippetFileType,
      //     this.indexCardContent.codeSnippetText
      //   );
      //   // break;
      // }
      // catch(e) {
      //   console.log(e);
      // }
    // }
  }

  ngOnChanges() {
  }



  copyToClipBoard(event: Event) {
    if (this.canEditValue) {
        return;
    }

    let navigatorVariable: any;
    navigatorVariable = window.navigator;
    navigatorVariable.clipboard.writeText(this.indexCardContent.codeSnippetText).then(
      function() {
        /* clipboard write Success */
      },
      function() {
        /* clipboard write Failed */
    });
  }

}
