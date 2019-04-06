import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { PageViewService } from '../core/services/page-view.service';
import BaseIndexCardModel from '../models/base-index-card.model';
import PageModel from '../models/page.model';

@Component({
  selector: 'app-page-view',
  templateUrl: './page-view.component.html',
  styleUrls: ['./page-view.component.scss']
})
export class PageViewComponent implements OnInit {
  public pageContent = new PageModel(
    [
      new BaseIndexCardModel(
        'A function in javascript',
`function name(parameter) {
    throw new Error("Not implemented yet");
}
`,
        'javascript'
      ),
      new BaseIndexCardModel(
        'A function in javascript 0',
`function name(parameter) {
    throw new Error("Not implemented yet");
}
`,
        'javascript'
      ),
      new BaseIndexCardModel(
        'A function in javascript 6',
`function name(parameter) {
    throw new Error("Not implemented yet");
}
`,
        'javascript'
      ),
      new BaseIndexCardModel(
        'A function in javascript 2',
`function name(parameter) {
    throw new Error("Not implemented yet");
}
`,
        'javascript'
      ),
      new BaseIndexCardModel(
        'A function in javascript 4',
`function name(parameter) {
    throw new Error("Not implemented yet");
}
`,
        'javascript'
      ),
      new BaseIndexCardModel(
        'A function in javascript 3',
`function name(parameter) {
    throw new Error("Not implemented yet");
}
`,
        'javascript'
      ),
      new BaseIndexCardModel(
        'A function in javascript 13',
`function name(parameter) {
    throw new Error("Not implemented yet");
}
function name(parameter) {
    throw new Error("Not implemented yet");
}
function name(parameter) {
    throw new Error("Not implemented yet");
}
function name(parameter) {
    throw new Error("Not implemented yet");
}
`,
        'javascript'
      )
    ],
    [
      new BaseIndexCardModel(
        'A function in python 9',
`def name(parameter):
    raise Exception('Not implemented yet')
`,
        'python'
      )
    ]
  );

  constructor(private pageViewService: PageViewService) {
    pageViewService.editModeOn = false;
  }

  ngOnInit() {
  }

  drop(event: CdkDragDrop<string[]>) {
    // If the Cheat Sheet Page is in edit mode Prevent Drag and Drop Behavior
    if (!this.pageViewService.editModeOn) {
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
