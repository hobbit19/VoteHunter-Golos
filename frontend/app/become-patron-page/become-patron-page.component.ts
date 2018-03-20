import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'vh-become-patron-page',
  templateUrl: './become-patron-page.component.html',
  styleUrls: ['./become-patron-page.component.less']
})
export class BecomePatronPageComponent implements OnInit {
  constructor(private route: ActivatedRoute) { }

  rewards: any;

  ngOnInit() {
    this.rewards = this.route.snapshot.data.rewards;
  }

  submit(reward) {
    console.log(reward);
  }

}
