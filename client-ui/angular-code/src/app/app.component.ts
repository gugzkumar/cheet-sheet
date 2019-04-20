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
  // onKeydown(event) {
  //   console.log(event);
  // if (event.keyCode === ENTER) {
  //     console.log('ENter');
  //   } else {
  //     // this.keyManager.onKeydown(event);
  //   }
  // }

  // @HostListener('document:keypress', ['$event'])
  // handleKeyboardEvent(event: KeyboardEvent) {
  //     console.log(event.key);
  //     console.log(event.keyCode);
  // }

  @HostListener('document:keydown.meta.s', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
      if (!this.sheetService.disableSave) {
        console.log('TEST');
      }
      event.preventDefault();
  }

}
