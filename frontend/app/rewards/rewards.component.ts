import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'vh-rewards',
  templateUrl: './rewards.component.html',
  styleUrls: ['./rewards.component.less']
})
export class RewardsComponent implements OnInit {
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();
  @Input() rewards: any[];

  chosenReward: any;

  constructor() { }

  ngOnInit() {
    if (this.rewards && this.rewards.length) {
      this.chosenReward = this.rewards[0];
    }
  }

  submit() {
    this.onSubmit.emit(this.chosenReward);
  }

}
