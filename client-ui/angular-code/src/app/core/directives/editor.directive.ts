import {
    Directive,
    ElementRef,
    EventEmitter,
    OnInit,
    OnChanges,
    Output,
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
    @Input() maxLines: number = 300;
    @Input() minLines: number = 1;
    @Input() clickEsc: () => {} = undefined;
    @Input() clickCtrlEnter: () => {} = undefined;
    @Output() getCodeEventEmitter: EventEmitter<() => any>;
    editor = null;

    constructor(
        private hostElement: ElementRef,
        private aceEditorService: AceEditorService
    ) {
    }
    ngOnInit() {
        try {
            this.editor = this.aceEditorService.setReadOnlyEditor(
              this.hostElement.nativeElement,
              this.language,
              this.code,
              this.readOnly,
              this.maxLines,
              this.minLines,
              this.clickEsc,
              this.clickCtrlEnter
            );
        }
        catch(e) {
            console.error(e);
        }
    }

    ngOnChanges() {
        try {
            this.editor = this.aceEditorService.setReadOnlyEditor(
              this.hostElement.nativeElement,
              this.language,
              this.code,
              this.readOnly,
              this.maxLines,
              this.minLines
            );
        }
        catch(e) {
            console.error(e);
        }
    }
}
