import {
  Component,
  Input,
  OnInit
} from '@angular/core';

@Component({
  selector: 'app-index-card',
  templateUrl: './index-card.component.html',
  styleUrls: ['./index-card.component.scss']
})
export class IndexCardComponent implements OnInit {
  @Input() name: String;
  public enableElevation:boolean = false;

  constructor() { }

  ngOnInit() {
  }


  copyToClipBoard(event: Event) {
    let newVariable: any;
    newVariable = window.navigator;

    console.log(newVariable);
    newVariable.clipboard.writeText(this.name).then(function() {
    },function() {
      /* clipboard write failed */
    });
  }

}
