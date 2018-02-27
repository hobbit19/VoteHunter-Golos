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

  ngOnInit() {
    this.api.getMyBakers().then((bakers) => {
      this.bakers = bakers;
    });

    this.api.getMyPosts().then((posts) => {
      this.posts = posts;
    });
  }

  @HostBinding('class') get classStr() {
    return 'cabinetPage';
  }

}
