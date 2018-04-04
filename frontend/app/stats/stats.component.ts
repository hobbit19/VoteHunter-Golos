import { Component, HostBinding, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from "../api.service";

@Component({
  selector: 'vh-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class StatsComponent implements OnInit {

  constructor(
    public api: ApiService
  ) { }

  items: any[];

  ngOnInit() {
     this.api.getStats().then((items) => {
       this.items = items;
     });
    this.api.getUserStats().then((data) => {
        this.items = [
          {name: 'Posts', num: data.posts},
          {name: 'Supporters', num: data.supporters},
          {name: 'Steem', num: data.golos},
          {name: 'Sum', num: '$' + data.sum},
        ]
    }, (data) => {});
  }

  @HostBinding('class') get classStr() {
    return 'stats';
  }

}
