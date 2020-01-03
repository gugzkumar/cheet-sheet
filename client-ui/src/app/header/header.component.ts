import { Component } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { SheetService } from '../core/services/sheet.service';
import { WorkspaceService } from '../core/services/workspace.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { HelpDialogComponent } from '../help-dialog/help-dialog.component';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

    constructor(
        public authService: AuthService,
        public sheetService: SheetService,
        public workspaceService: WorkspaceService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
    ) {}

    onClickDeleteSheet() {
        this.dialog.open(ConfirmationDialogComponent, {
            'data': {
                'message': `Are you sure you would like to delete ${this.sheetService.currentSheetName}?\n` +
                  `This will also remove all index cards associated with this sheet.\n` +
                  `This can't be undone`,
                'onConfirm': () => {
                    const sheetName = this.sheetService.currentSheetName;
                    const indexOfSheetToSwitchTo = Math.abs(
                        this.sheetService.availableSheets.indexOf(sheetName) - 1,
                    );
                    const sheetNameToSwitchTo = this.sheetService.availableSheets[indexOfSheetToSwitchTo];
                    this.sheetService.deleteSheet(sheetName).subscribe(
                        () => {
                            // If apiRequest is successfull, refresh sheetMenu, and switch to newly created sheet
                            // and close the dialog
                            this.sheetService.loadSheetMenu();
                            this.sheetService.setSelectedSheet(sheetNameToSwitchTo);
                            this.snackBar.open(`${sheetName} and all of its index cards are deleted`, '', {
                                duration: 1500,
                            });
                        },
                        (errorResponse) => {
                            // If apiRequest is unsuccessfull show red snack bar with the error message
                            this.snackBar.open(errorResponse['error']['message'], '', {
                                duration: 1500,
                                panelClass: ['red-snackbar']
                            });
                        }
                    );
                }
            },
            'disableClose': false,
            'maxWidth': 500
        });
    }

    onClickSave() {
        this.sheetService.saveCurrentSheet().subscribe(
            () => {
                // If apiRequest is successfull show a successfull snackbar
                this.snackBar.open('Changes saved', '', {
                    duration: 1500,
                });
            },
            (errorResponse) => {
                // If apiRequest is unsuccessfull show red snack bar with the error message
                this.snackBar.open(errorResponse['error']['message'], '', {
                    duration: 1500,
                    panelClass: ['red-snackbar']
                });
            }
        );;
    }

    onClickNewSheet() {
        this.sheetService.createNewBaseIndexCard();
        this.snackBar.open(`New blank index card created`, '', {
            duration: 1500,
        });
    }

    onClickHelp() {
        this.dialog.open(HelpDialogComponent, { autoFocus: false });
    }

}
