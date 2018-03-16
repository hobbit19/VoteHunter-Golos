import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'vh-category-page',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.less']
})
export class CategoryPageComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    /*this.route.params.subscribe(params => {
      console.log(params['id']);
    });*/
  }
}
