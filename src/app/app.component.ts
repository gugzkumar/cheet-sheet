import { Component } from '@angular/core';
import { SheetService } from './core/services/sheet.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private sheetService: SheetService) { }

  title = 'cheat-sheet';
}
