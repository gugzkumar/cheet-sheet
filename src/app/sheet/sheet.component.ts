import { Component, OnInit } from '@angular/core';
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
export class SheetComponent implements OnInit {

    constructor(private sheetService: SheetService) {
        sheetService.editModeOn = true;
    }

    ngOnInit() {
    }

    drop(event: CdkDragDrop<string[]>) {
        // If the Cheat Sheet Page is in edit mode Prevent Drag and Drop Behavior
        if (!this.sheetService.editModeOn) {
            return;
        }

        // Logic to rearrange data in Drag and Drop
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data,
                              event.container.data,
                              event.previousIndex,
                              event.currentIndex);
        }
    }
}
