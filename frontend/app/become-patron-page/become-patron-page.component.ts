import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MediatorService} from '../mediator.service';

@Component({
  selector: 'vh-become-patron-page',
  templateUrl: './become-patron-page.component.html',
  styleUrls: ['./become-patron-page.component.less']
})
export class BecomePatronPageComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mediator: MediatorService
    ) { }

  rewards: any;

  ngOnInit() {
    this.rewards = this.route.snapshot.data.rewards;
  }

  submit(reward) {
    this.mediator.requisitesCallback = () => {
      console.log('requisites page callback');
    };

    this.router.navigateByUrl('requisites');
  }

}
