import { Component } from '@angular/core';

import {
  MatDialogRef,
  MatSnackBar
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
        private sheetService: SheetService,
        private snackBar: MatSnackBar
    ) { }

    onClickCreate() {
        console.log(this.sheetName);
        this.sheetService.createSheet(this.sheetName, this.defaultFileType).subscribe(
            () => {
              // If apiRequest is successfull, refresh sheetMenu, and switch to newly created sheet
              // and close the dialog
              this.sheetService.loadSheetMenu();
              this.sheetService.setSelectedSheet(this.sheetName);
              this.dialogRef.close();
              this.snackBar.open(`Empty sheet ${this.sheetName} created`, '', {
                  duration: 800,
              });
            },
            (errorResponse) => {
              // If apiRequest is unsuccessfull show red snack bar with the error message
              this.snackBar.open(errorResponse['error']['message'], '', {
                  duration: 1200,
                  panelClass: ['red-snackbar']
              });
            }
        );
    }

}
