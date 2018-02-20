import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from "../api.service";

@Component({
  selector: 'vh-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class MainPageComponent implements OnInit {
  constructor(
    public api: ApiService
  ) { }

  authors: any[];
  newAuthors: any[];
  newFaces: any[];
  bakers: any[];
  categories: any[];

  ngOnInit() {
    this.api.getAuthors().then((authors) => {
      this.authors = authors;
    });

    this.api.getNewAuthors().then((authors) => {
      this.newAuthors = authors;
    });

    this.api.getNewFaces().then((newFaces) => {
      this.newFaces = newFaces;
    });

    this.api.getBakers().then((bakers) => {
      this.bakers = bakers;
    });

    this.api.getCategories().then((categories) => {
      this.categories = categories;
    });
  }

}
