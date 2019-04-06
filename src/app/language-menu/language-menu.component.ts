import { Component, OnInit } from '@angular/core';
import { PageViewService } from '../core/services/page-view.service';

@Component({
  selector: 'app-language-menu',
  templateUrl: './language-menu.component.html',
  styleUrls: ['./language-menu.component.scss']
})
export class LanguageMenuComponent implements OnInit {

  constructor(private pageViewService: PageViewService) { }

  ngOnInit() {
  }

}
