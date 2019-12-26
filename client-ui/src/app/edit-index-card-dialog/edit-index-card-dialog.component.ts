import { Component, Inject, ViewChild } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material';
import { SheetService } from '../core/services/sheet.service';
import { EditorDirective } from '../core/directives/editor.directive';

@Component({
    selector: 'app-edit-index-card-dialog',
    templateUrl: './edit-index-card-dialog.component.html',
    styleUrls: ['./edit-index-card-dialog.component.scss']
})
export class EditIndexCardDialogComponent {
    @ViewChild(EditorDirective) directive: EditorDirective;
    constructor(
        public dialogRef: MatDialogRef<EditIndexCardDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {
            'indexCardTitle': string,
            'fileContent': string,
            'fileType': string
        },
        public sheetService: SheetService
    ) {
        this.sheetService.disableSave = true;
    }

    onClickOk() {
        this.sheetService.disableSave = false;
        this.dialogRef.close({
            'indexCardTitle': this.data.indexCardTitle,
            'fileContent': this.directive.editor.getValue(),
            'fileType': this.data.fileType
        });
    }

    onClickCtrlEnter = this.onClickOk.bind(this);
    onClickEsc = function () {
        this.sheetService.disableSave = false;
        this.dialogRef.close()
    }.bind(this);

}
