import { Component } from '@angular/core';

import {
  MatDialogRef
} from '@angular/material';
import { SheetService } from '../core/services/sheet.service';

@Component({
    selector: 'app-create-sheet-dialog',
    templateUrl: './create-sheet-dialog.component.html',
    styleUrls: ['./create-sheet-dialog.component.scss']
})
export class CreateSheetDialogComponent {
    public sheetName: string;
    public defaultFileType: string;

    constructor(
        public dialogRef: MatDialogRef<CreateSheetDialogComponent>,
        private sheetService: SheetService
    ) { }

    onClickCreate() {
        console.log(this.sheetName);
        this.sheetService.createNewSheet(this.sheetName, this.defaultFileType);
        this.dialogRef.close();
    }

}
