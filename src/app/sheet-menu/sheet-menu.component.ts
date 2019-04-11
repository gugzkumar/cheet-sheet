import { Component, OnInit } from '@angular/core';
import { PageViewService } from '../core/services/page-view.service';

@Component({
  selector: 'app-sheet-menu',
  templateUrl: './sheet-menu.component.html',
  styleUrls: ['./sheet-menu.component.scss']
})
export class SheetMenuComponent implements OnInit {

  constructor(private pageViewService: PageViewService) { }

  ngOnInit() {
  }

}
