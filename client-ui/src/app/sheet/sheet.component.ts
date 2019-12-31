import { Component } from '@angular/core';
import {
    CdkDragDrop,
    moveItemInArray,
    transferArrayItem
} from '@angular/cdk/drag-drop';
import { SheetService } from '../core/services/sheet.service';
import { WorkspaceService } from '../core/services/workspace.service';

@Component({
    selector: 'app-sheet',
    templateUrl: './sheet.component.html',
    styleUrls: ['./sheet.component.scss']
})
export class SheetComponent {

    constructor(public sheetService: SheetService, private workspaceService: WorkspaceService) {
        this.workspaceService.initWorkspaceRouterListener();
    }

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

    hasNoCards() {
        return (
            this.sheetService.currentSheetValue &&
            this.sheetService.currentSheetValue.leftIndexCards.length < 1 &&
            this.sheetService.currentSheetValue.leftIndexCards.length < 1
        );
    }

    generateOnRemoveFunction(index: number, side: string): () => any {
        return () => {
            if (side === 'left') {
                this.sheetService.currentSheetValue.leftIndexCards.splice(index, 1);
                this.sheetService.currentSheetValue.isDirty = true;
            }

            if (side === 'right') {
                this.sheetService.currentSheetValue.rightIndexCards.splice(index, 1);
                this.sheetService.currentSheetValue.isDirty = true;
            }
        }
    }
}
