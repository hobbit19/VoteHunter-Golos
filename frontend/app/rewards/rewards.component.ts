import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'vh-rewards',
  templateUrl: './rewards.component.html',
  styleUrls: ['./rewards.component.less']
})
export class RewardsComponent implements OnInit {
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();
  @Input() rewards: any[];
  @Input() minValue: number;

  chosenReward: any;

  constructor() { }

  ngOnInit() {
    if (this.rewards && this.rewards.length) {
      this.chosenReward = this.rewards[0];
      this.rewards.forEach((item, key) => {
        if(item.amount == this.minValue) {
            this.chosenReward = this.rewards[key];
        }
      });
    }
  }

  submit() {
    this.onSubmit.emit(this.chosenReward);
  }

  chooseReward(reward) {
    if(parseInt(reward.amount) < this.minValue) {

      return false;
    }
    this.chosenReward = reward;
  }

}
