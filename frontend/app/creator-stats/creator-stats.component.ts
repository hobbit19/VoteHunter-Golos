import { Component, HostBinding, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'vh-creator-stats',
  templateUrl: './creator-stats.component.html',
  styleUrls: ['./creator-stats.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class CreatorStatsComponent implements OnInit {
  @Input() data: any;

  constructor() { }

  ngOnInit() {
  }

  @HostBinding('class') get classStr() {
    return 'creatorStats section';
  }

}
