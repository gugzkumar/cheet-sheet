import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { PageViewService } from '../core/services/page-view.service';

@Component({
  selector: 'app-page-view',
  templateUrl: './page-view.component.html',
  styleUrls: ['./page-view.component.scss']
})
export class PageViewComponent implements OnInit {
  // index Cards on Left side of the Page
  public indexCardsLeft = [
    'Get to work',
    'Pick up groceries',
    'Go home',
    'Fall asleep'
  ];
  // index Cards on RIGHT side of the page
  public indexCardsRight = [
    'Get up',
    'Brush teeth',
    'Take a shower',
    'Check e-mail',
    'Walk dog'
  ];

  constructor(private pageViewService: PageViewService) {
    pageViewService.editModeOn = false;
  }

  ngOnInit() {
  }

  drop(event: CdkDragDrop<string[]>) {
    if (!this.pageViewService.editModeOn) {
      return;
    }
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
