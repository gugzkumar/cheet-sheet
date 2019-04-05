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

  // Two Way Bindable canEdit property
  public canEditValue:boolean;
  @Input()
  get canEdit(): boolean{
    return this.canEditValue;
  }
  set canEdit(val: boolean) {
    this.canEditValue = val;
  }


  constructor() { }

  ngOnInit() {
  }

  copyToClipBoard(event: Event) {
    if (this.canEditValue) {
        return;
    }

    let newVariable: any;
    newVariable = window.navigator;

    console.log(newVariable);
    newVariable.clipboard.writeText(this.name).then(function() {
    },function() {
      /* clipboard write failed */
    });
  }

}
