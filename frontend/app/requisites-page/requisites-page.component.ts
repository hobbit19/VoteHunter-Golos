import {Component, HostBinding, OnInit, ViewEncapsulation} from '@angular/core';
import {UserService} from '../user.service';
import {Router} from '@angular/router';
import {ApiService} from '../api.service';
import {DOMService} from '../dom.service';
import {MediatorService} from '../mediator.service';

@Component({
  selector: 'vh-requisites-page',
  templateUrl: './requisites-page.component.html',
  styleUrls: ['./requisites-page.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class RequisitesPageComponent implements OnInit {
  login: string;
  password: string;

  constructor(public api: ApiService,
              public router: Router,
              public user: UserService,
              public domService: DOMService,
              public mediator: MediatorService
              ) {
  }

  ngOnInit() {
  }

  @HostBinding('class') get classStr() {
    return 'requisitesPage block';
  }

  submit(event) {
   this.mediator.requisitesCallback();
  }

}
