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
  isPatron?: boolean;

  constructor(
    public api: ApiService,
    public user: UserService,
    private route: ActivatedRoute
  ) { }

  posts: any;

  ngOnInit() {
      this.profile = this.route.snapshot.data.profile.profile;
      this.isPatron = this.route.snapshot.data.profile.isPatron;

      if (this.profile.promo_video) {
          this.profile.promo_video = this.profile.promo_video.replace('watch?v=', 'embed/')
      }

      this.api.getPosts().then((data) => {
        this.posts = data.posts;
      });
  }

  @HostBinding('class') get classStr() {
    return 'creatorPage';
  }

}
