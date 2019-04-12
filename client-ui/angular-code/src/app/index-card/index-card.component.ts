import {
  Component,
  Input,
} from '@angular/core';

import {
  MatDialog,
  MatSnackBar
} from '@angular/material';

import BaseIndexCard from '../models/base-index-card';
import { EditIndexCardDialogComponent } from '../edit-index-card-dialog/edit-index-card-dialog.component';

@Component({
  selector: 'app-index-card',
  templateUrl: './index-card.component.html',
  styleUrls: ['./index-card.component.scss']
})
export class IndexCardComponent {
  @Input() indexCard: BaseIndexCard;
  // @Input() indexCardContent: BaseIndexCardModel;
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
    private dialog: MatDialog
  ) {
  }


  clickEdit() {
    this.dialog.open(EditIndexCardDialogComponent, {
        'data': {
          'message': `Are you sure you would like to delete` +
            `This will remove all index cards associated language.`,
          'onConfirm': () => {}
        },
        'disableClose': true
      }
    );
  }

  clickDelete() {
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
    });

  }

}
