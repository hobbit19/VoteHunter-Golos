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


    this.api.getPosts().then((data) => {
      this.posts = data.posts;
    });

    this.api.getUserPatrons().then((res) => {
      this.bakers = res.patrons;
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
