import { Component, HostBinding, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'vh-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class PostsComponent implements OnInit {
  @Input() titleStr: string;
  @Input() className: string;
  @Input() items: any[];

  constructor() { }

  ngOnInit() {
  }

  @HostBinding('class') get classStr() {
    let className = 'posts';

    if (this.className) {
      className += ` ${this.className}`;
    }

    return className;
  }

}
