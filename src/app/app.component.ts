import { Component } from '@angular/core';
import { PageViewService } from './core/services/page-view.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private pageViewService: PageViewService) { }

  title = 'cheat-sheet';
}
