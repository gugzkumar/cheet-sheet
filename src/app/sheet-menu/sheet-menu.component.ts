import { Component, OnInit } from '@angular/core';
import { SheetService } from '../core/services/sheet.service';

@Component({
  selector: 'app-sheet-menu',
  templateUrl: './sheet-menu.component.html',
  styleUrls: ['./sheet-menu.component.scss']
})
export class SheetMenuComponent implements OnInit {

  constructor(private sheetService: SheetService) { }

  ngOnInit() {
  }

}
