import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from "../user.service";
import { MediatorService } from "../mediator.service";

@Component({
  selector: 'vh-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit {

  constructor(
    public user: UserService,
    public mediator: MediatorService
  ) { }

  ngOnInit() {
  }

}
