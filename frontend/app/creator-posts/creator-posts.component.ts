import { Component, HostBinding, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'vh-creator-posts',
  templateUrl: './creator-posts.component.html',
  styleUrls: ['./creator-posts.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class CreatorPostsComponent implements OnInit {
  @Input() posts: any[];

  constructor() { }

  ngOnInit() {
  }

  @HostBinding('class') get classStr() {
    return 'creatorPosts';
  }
}
