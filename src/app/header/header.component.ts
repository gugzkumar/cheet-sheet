import { Component, OnInit } from '@angular/core';
import { PageViewService } from '../core/services/page-view.service';
import { AuthService } from '../core/services/auth.service';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    private pageViewService: PageViewService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit() {
  }

  showConfirmation() {
    this.dialog.open(ConfirmationDialogComponent, {
        'data': {
          'message': `Are you sure you would like to delete ${this.pageViewService.currentSheetName}?\n` +
            `This will remove all index cards associated sheet.`,
          'onConfirm': () => {}
        },
        'disableClose': false,
        'maxWidth': 500
      }
    );
  }

}
