import { Component, HostListener } from '@angular/core';
import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { ENTER } from '@angular/cdk/keycodes';
import { SheetService } from './core/services/sheet.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private sheetService: SheetService) { }

  title = 'cheat-sheet';

  @HostListener('document:keydown.meta.s', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
      if (!this.sheetService.disableSave) {
          this.sheetService.saveCurrentSheet();
      }
      event.preventDefault();
  }

}
