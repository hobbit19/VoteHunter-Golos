import { Component, HostBinding, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'vh-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class CategoriesComponent implements OnInit {
  @Input() className: string;
  @Input() items: any[];

  constructor() { }

  ngOnInit() {
  }

  @HostBinding('class') get classStr() {
    return 'categories ' + this.className;
  }

}
