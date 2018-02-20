import { Component, HostBinding, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'vh-socials',
  templateUrl: './socials.component.html',
  styleUrls: ['./socials.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class SocialsComponent implements OnInit {
  @Input() className: string;

  constructor() { }

  ngOnInit() {
  }

  @HostBinding('class') get classStr() {
    return 'socials ' + this.className;
  }

}
