import { Component, HostBinding, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from "../api.service";

@Component({
  selector: 'vh-cabinet-page',
  templateUrl: './cabinet-page.component.html',
  styleUrls: ['./cabinet-page.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class CabinetPageComponent implements OnInit {

  constructor(
    public api: ApiService
  ) { }

  bakers: any[];
  posts: any[];
  profile: any;

  ngOnInit() {
    this.api.getMyBakers().then((bakers) => {
      this.bakers = bakers;
    });

    this.api.getMyPosts().then((posts) => {
      this.posts = posts;
    });

    this.api.getProfile().then((data) => {
          this.profile = data.profile;
        },
        (data) => {

        });
  }

  @HostBinding('class') get classStr() {
    return 'cabinetPage';
  }

}
