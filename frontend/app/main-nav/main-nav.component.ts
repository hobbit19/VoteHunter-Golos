import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'vh-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.less']
})
export class MainNavComponent implements OnInit {

  @Input() profileUrl: string;

  constructor() { }

  ngOnInit() {

  }

}
