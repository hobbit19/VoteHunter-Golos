import { Component, HostBinding, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from "../api.service";
import { UserService } from "../user.service";
import {ActivatedRoute} from '@angular/router';

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
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    //console.log(this.route.snapshot.data.profile);
      this.profile = this.route.snapshot.data.profile;
      if(this.profile.promo_video) {
          this.profile.promo_video = this.profile.promo_video.replace('watch?v=', 'embed/')
      }
  }

  @HostBinding('class') get classStr() {
    return 'creatorPage';
  }

}
