import { Component, HostBinding, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from "../api.service";
import { UserService } from "../user.service";

@Component({
  selector: 'vh-creator-banner',
  templateUrl: './creator-banner.component.html',
  styleUrls: ['./creator-banner.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class CreatorBannerComponent implements OnInit {

  constructor(
    public api: ApiService,
    public user: UserService,
  ) { }

  @Input() profile: any;

  ngOnInit() {
  }

  @HostBinding('class') get classStr() {
    return 'creatorBanner';
  }

}
