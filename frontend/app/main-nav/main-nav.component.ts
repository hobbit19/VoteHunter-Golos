import {Component, Input, OnInit} from '@angular/core';
import {UserService} from '../user.service';

@Component({
  selector: 'vh-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.less']
})
export class MainNavComponent implements OnInit {

  @Input() profileUrl: string;

  constructor(
      public user: UserService,
  ) { }

  ngOnInit() {
    if(!this.profileUrl && this.user.isLoggedIn) {
        this.profileUrl = this.user.profile_url;
    }
  }

}
