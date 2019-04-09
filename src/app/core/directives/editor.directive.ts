import {
  Directive,
  ElementRef,
  Renderer2,
  OnInit,
  OnChanges,
  Input
} from '@angular/core';
import { AceEditorService } from '../services/ace-editor.service';

@Directive({
  selector: '[editor]'
})
export class EditorDirective implements OnInit, OnChanges {
  @Input() editor: string;


  constructor(
    private renderer: Renderer2,
    private hostElement: ElementRef,
    private aceEditorService: AceEditorService
  ) {
  }
  ngOnInit() {
    this.renderer.setAttribute(this.hostElement.nativeElement, 'id', this.editor.replace(/\s/gi, '-'));
    try {
      this.aceEditorService.setReadOnlyEditor(
        this.editor.replace(/\s/gi, '-'),
        'JavaScript',
        `
        const x =3;
        `
      );

    }
    catch(e) {
      console.error(e);
    }
  }

  ngOnChanges() {
    this.renderer.setAttribute(this.hostElement.nativeElement, 'id', 'somedamnclass');
    console.log(this.hostElement.nativeElement);
    try {
      this.aceEditorService.setReadOnlyEditor(
        'somedamnclass',
        'JavaScript',
        `
        const x =3;
        `
      );

    }
    catch(e) {
      console.error(e);
    }
  }

}
