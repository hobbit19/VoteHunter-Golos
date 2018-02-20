import { Component, OnInit, ViewEncapsulation, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'vh-persons',
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class PersonsComponent implements OnInit {
  @Input() headingStr: string;
  @Input() className: string;
  @Input() items: any[];

  constructor() { }

  ngOnInit() {
  }

  @HostBinding('class') get classStr() {
    return 'persons ' + this.className;
  }

}
