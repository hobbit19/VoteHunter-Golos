import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ApiService} from '../api.service';
import {UserService} from '../user.service';

let golos = require('golos-js');

@Component({
  selector: 'vh-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class MainPageComponent implements OnInit {
  constructor(public user: UserService,
              public api: ApiService) {
  }

  authors: any[];
  newAuthors: any[];
  categories: any[];

  ngOnInit() {
    this.api.getAuthors({order: 'last', limit: 6}).then((res) => {
      this.authors = res.authors;
    });

    this.api.getAuthors({order: 'popular', limit: 6}).then((res) => {
      this.newAuthors = res.authors;
    });

    this.api.getCategories().then((data) => {
      this.categories = data.cats;
    });
  }

}
