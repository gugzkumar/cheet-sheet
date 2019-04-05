import { Component, OnInit } from '@angular/core';
import { PageViewService } from '../core/services/page-view.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private pageViewService: PageViewService) {
  }

  ngOnInit() {
  }

}
