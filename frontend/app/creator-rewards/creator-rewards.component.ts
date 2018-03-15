import { Component, HostBinding, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'vh-creator-rewards',
  templateUrl: './creator-rewards.component.html',
  styleUrls: ['./creator-rewards.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class CreatorRewardsComponent implements OnInit {
  @Input() rewards: any;

  constructor() { }

  ngOnInit() {
  }

  @HostBinding('class') get classStr() {
    return 'creatorRewards section';
  }

}

