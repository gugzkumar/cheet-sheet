import { Component, OnInit } from '@angular/core';
import {
  MatDialogRef
} from '@angular/material';
import { SheetService } from '../core/services/sheet.service';

@Component({
    selector: 'app-edit-index-card-dialog',
    templateUrl: './edit-index-card-dialog.component.html',
    styleUrls: ['./edit-index-card-dialog.component.scss']
})
export class EditIndexCardDialogComponent {

    constructor(
        public dialogRef: MatDialogRef<EditIndexCardDialogComponent>,
        private sheetService: SheetService
    ) { }

    ngOnInit() {
    }



}
