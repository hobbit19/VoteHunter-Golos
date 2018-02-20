import { Component, HostBinding, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'vh-live-search',
  templateUrl: './live-search.component.html',
  styleUrls: ['./live-search.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class LiveSearchComponent implements OnInit {

  @Input() className: string;

  constructor() { }

  ngOnInit() {
  }

  @HostBinding('class') get classStr() {
    let className = 'liveSearch';

    if (this.className) {
      className += ` ${this.className}`;
    }

    return className;
  }

}
