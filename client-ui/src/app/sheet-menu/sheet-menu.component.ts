import { Component } from '@angular/core';
import { SheetService } from '../core/services/sheet.service';
import { MatDialog } from '@angular/material';
import { CreateSheetDialogComponent } from '../create-sheet-dialog/create-sheet-dialog.component';

@Component({
  selector: 'app-sheet-menu',
  templateUrl: './sheet-menu.component.html',
  styleUrls: ['./sheet-menu.component.scss']
})
export class SheetMenuComponent {

  constructor(
      public sheetService: SheetService,
      private dialog: MatDialog
  ) {
  }

  onClickAddNewSheet() {
      this.dialog.open(CreateSheetDialogComponent, {
              'data': {
                  'onConfirm': () => {}
              },
              'disableClose': false,
              'maxWidth': 500
          }
      );
  }


}
