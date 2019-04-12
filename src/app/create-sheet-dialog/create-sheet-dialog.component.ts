import { Component } from '@angular/core';

import {
  MatDialogRef
} from '@angular/material';

@Component({
    selector: 'app-create-sheet-dialog',
    templateUrl: './create-sheet-dialog.component.html',
    styleUrls: ['./create-sheet-dialog.component.scss']
})
export class CreateSheetDialogComponent {

    constructor(
        public dialogRef: MatDialogRef<CreateSheetDialogComponent>,
    ) { }

    onClickCreate() {
        this.dialogRef.close();
    }

    onClickCancel() {
        this.dialogRef.close();
    }

}
