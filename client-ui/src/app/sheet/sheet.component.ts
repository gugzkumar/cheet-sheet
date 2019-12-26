import { Component } from '@angular/core';
import {
    CdkDragDrop,
    moveItemInArray,
    transferArrayItem
} from '@angular/cdk/drag-drop';
import { SheetService } from '../core/services/sheet.service';

@Component({
    selector: 'app-sheet',
    templateUrl: './sheet.component.html',
    styleUrls: ['./sheet.component.scss']
})
export class SheetComponent {

    constructor(public sheetService: SheetService) {}

    drop(event: CdkDragDrop<string[]>) {
        // If the Cheat Sheet Page is in edit mode Prevent Drag and Drop Behavior
        if (!this.sheetService.editModeOn) {
            return;
        }

        // Logic to rearrange data in Drag and Drop
        if (event.previousContainer === event.container) {
            if(event.previousIndex !== event.currentIndex) {
                this.sheetService.currentSheetValue.isDirty = true;
            }
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data,
                              event.container.data,
                              event.previousIndex,
                              event.currentIndex);
            this.sheetService.currentSheetValue.isDirty = true;
        }
    }
}
