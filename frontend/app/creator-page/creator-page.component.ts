import { Component, HostBinding, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from "../api.service";
import { UserService } from "../user.service";

@Component({
  selector: 'vh-creator-page',
  templateUrl: './creator-page.component.html',
  styleUrls: ['./creator-page.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class CreatorPageComponent implements OnInit {
  profile: any;

  constructor(
    public api: ApiService,
    public user: UserService,
  ) { }

  ngOnInit() {
    this.api.getUserProfile(this.user.id).then((profile) => {
      this.profile = profile;
    });
  }

  @HostBinding('class') get classStr() {
    return 'creatorPage';
  }

}
