import { Component, HostBinding, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'vh-creator-goal',
  templateUrl: './creator-goal.component.html',
  styleUrls: ['./creator-goal.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class CreatorGoalComponent implements OnInit {
  @Input() goals: any;

  constructor() { }

  ngOnInit() {
  }

  @HostBinding('class') get classStr() {
    return 'creatorGoal section';
  }

}
