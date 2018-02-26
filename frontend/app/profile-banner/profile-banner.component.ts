import { Component, HostBinding, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from "../api.service";
import { UserService } from "../user.service";

@Component({
  selector: 'vh-profile-banner',
  templateUrl: './profile-banner.component.html',
  styleUrls: ['./profile-banner.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileBannerComponent implements OnInit {

  constructor(
    public api: ApiService,
    public user: UserService,
  ) { }

  profile?: any;

  ngOnInit() {
    this.api.getProfile(this.user.id).then((profile) => {
      this.profile = profile;
    });
  }

  @HostBinding('class') get classStr() {
    return 'profileBanner';
  }

}
