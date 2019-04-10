import {
  Component,
  ElementRef,
  Input,
  Inject,
  OnInit
} from '@angular/core';

import {
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
        'message': string,
        'onConfirm': () => {},
    }
  ) {
  }

  onClickYes() {
    this.data.onConfirm();
    this.dialogRef.close();

  }

  ngOnInit() {
  }

}
