import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-index-card',
  templateUrl: './index-card.component.html',
  styleUrls: ['./index-card.component.scss']
})
export class IndexCardComponent implements OnInit {
  public enableElevation:boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
