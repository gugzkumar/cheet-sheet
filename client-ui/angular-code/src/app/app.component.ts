import { Component, HostListener } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { SheetService } from './core/services/sheet.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    constructor(
      private sheetService: SheetService,
      private snackBar: MatSnackBar
    ) { }

    title = 'cheat-sheet';


    // KeyBoard Events For The App
    @HostListener('document:keydown.meta.s', ['$event'])
    handleKeyboardEventCommandS(event: KeyboardEvent) {
        if (!this.sheetService.disableSave && this.sheetService.currentSheetValue.isDirty) {
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
        event.preventDefault();
    }

    @HostListener('document:keydown.meta.e', ['$event'])
    handleKeyboardEventCommandE(event: KeyboardEvent) {
        this.sheetService.editModeOn = !this.sheetService.editModeOn
        event.preventDefault();
    }

}
