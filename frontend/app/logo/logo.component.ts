import { Component, HostBinding, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'vh-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class LogoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @HostBinding('class') get classStr() {
    return 'logo';
  }

}
