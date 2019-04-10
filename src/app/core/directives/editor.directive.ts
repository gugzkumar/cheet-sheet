import {
  Directive,
  ElementRef,
  OnInit,
  OnChanges,
  Input
} from '@angular/core';
import { AceEditorService } from '../services/ace-editor.service';

@Directive({
  selector: '[editor]'
})
export class EditorDirective implements OnInit, OnChanges {
  @Input() language: string = 'typescript';
  @Input() code: string = ``;
  @Input() readOnly: boolean = true;
  @Input() maxLines: number = 50;

  constructor(
    private hostElement: ElementRef,
    private aceEditorService: AceEditorService
  ) {
  }
  ngOnInit() {
    try {
      this.aceEditorService.setReadOnlyEditor(
        this.hostElement.nativeElement,
        this.language,
        this.code,
        this.readOnly,
        this.maxLines,
      );
    }
    catch(e) {
      console.error(e);
    }
  }

  ngOnChanges() {
    try {
      this.aceEditorService.setReadOnlyEditor(
        this.hostElement.nativeElement,
        this.language,
        this.code,
        this.readOnly,
        this.maxLines
      );

    }
    catch(e) {
      console.error(e);
    }
  }

}
