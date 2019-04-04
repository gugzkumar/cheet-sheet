import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-view',
  templateUrl: './page-view.component.html',
  styleUrls: ['./page-view.component.scss']
})
export class PageViewComponent implements OnInit {
  // index Cards on Left side of the Page
  public indexCardsLeft = [

  ];
  // index Cards on RIGHT side of the page
  public indexCardsRight = [

  ];
  constructor() { }

  ngOnInit() {
  }

}
