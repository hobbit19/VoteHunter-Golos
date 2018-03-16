import { Component, HostBinding, Input, OnInit, ViewEncapsulation } from '@angular/core';
import {ApiService} from '../api.service';

let golos = require('golos-js');
//golos.config.set('websocket', 'wss://ws.testnet3.golos.io');
///golos.config.set('chain_id', '5876894a41e6361bde2e73278f07340f2eb8b41c2facd29099de9deef6cdb679');

@Component({
  selector: 'vh-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class AuthorsComponent implements OnInit {
  @Input() titleStr: string;
  @Input() className: string;
  @Input() needFilters: boolean;
  @Input() items: any[];

  filter = 'today';

  constructor(
      public api: ApiService,
  ) { }

  ngOnInit() {

  }

  applyFilter(filter: string) {
    this.filter = filter;
  }

  @HostBinding('class') get classStr() {
    let cl = 'authors';

    if (this.className) {
      cl += ' ' + this.className;
    }

    return cl;
  }


}
