import {Component, HostBinding, Input, OnInit, ViewEncapsulation} from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'vh-creator-overview',
  templateUrl: './creator-overview.component.html',
  styleUrls: ['./creator-overview.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class CreatorOverviewComponent implements OnInit {
  @Input() profile: any;

  constructor(
    public sanitizer: DomSanitizer
  ) {
  }

  ngOnInit() {
  }

  @HostBinding('class') get classStr() {
    return 'creatorOverview section';
  }

}
