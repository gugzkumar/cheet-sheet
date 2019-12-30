import {
    Component,
    Input,
    ViewChild
} from '@angular/core';

import {
    MatDialog,
    MatSnackBar
} from '@angular/material';

import BaseIndexCard from '../models/base-index-card';
import { EditIndexCardDialogComponent } from '../edit-index-card-dialog/edit-index-card-dialog.component';
import { EditorDirective } from '../core/directives/editor.directive';
import { SheetService } from '../core/services/sheet.service';


@Component({
    selector: 'app-index-card',
    templateUrl: './index-card.component.html',
    styleUrls: ['./index-card.component.scss']
})
export class IndexCardComponent {
    @ViewChild(EditorDirective) directive: EditorDirective;
    @Input() indexCard: BaseIndexCard;
    @Input() onClickRemove: () => any;
    public enableElevation:boolean = false;

    // Two Way Bindable canEdit property. If can edit, clipboard functionality is
    // blocked
    public canEditValue:boolean;

    @Input()
    get canEdit(): boolean{
        return this.canEditValue;
    }
    set canEdit(val: boolean) {
        this.canEditValue = val;
    }

    constructor(
        private snackBar: MatSnackBar,
        private dialog: MatDialog,
        private sheetService: SheetService
    ) {
    }


    clickEdit() {
        const editDialog = this.dialog.open(EditIndexCardDialogComponent, {
            'data': {
              'indexCardTitle': this.indexCard.indexCardTitle,
              'fileContent': this.indexCard.fileContent,
              'fileType': this.indexCard.fileType
            },
            'disableClose': true,
            'autoFocus': false
          }
        );
        editDialog.afterClosed().subscribe((data)=>{
            if (!data) {
                return;
            }
            const newIndexCardTitle = data.indexCardTitle;
            const newFileContent = data.fileContent;
            const newFileType = data.fileType;
            if (
                newIndexCardTitle != this.indexCard.indexCardTitle ||
                newFileType != this.indexCard.fileType ||
                newFileContent != this.indexCard.fileContent
            ) {
                this.indexCard.indexCardTitle = newIndexCardTitle;
                this.indexCard.fileType = newFileType;
                this.indexCard.fileContent = newFileContent;
                this.directive.setContent(newFileContent);
                this.directive.setFileType(newFileType);
                this.sheetService.currentSheetValue.isDirty = true;
            }
        })
    }

    clickRemove() {
        this.onClickRemove();
    }


    copyToClipBoard() {
    if (this.canEditValue) {
        return;
    }

    let navigatorVariable: any;
    navigatorVariable = window.navigator;
    navigatorVariable.clipboard.writeText(this.indexCard.fileContent).then(
        () => {
            this.snackBar.open('Code snippet copied to your clipboard', '', {
                duration: 800,
            });
        },
        () => {
            this.snackBar.open('ERROR: Unable to copy snippet to your clipboard', '', {
                duration: 800,
            });
        }
    );

  }

}
