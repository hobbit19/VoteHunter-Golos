import {Component, ElementRef, HostBinding, Input, OnInit, ViewEncapsulation} from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'vh-creator-overview',
  templateUrl: './creator-overview.component.html',
  styleUrls: ['./creator-overview.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class CreatorOverviewComponent {
  @Input() profile: any;

  constructor(
    public sanitizer: DomSanitizer,
    public elementRef: ElementRef,
  ) {
  }

  ngAfterViewInit() {
    if (this.profile && this.profile.promo_video) {
      let iframe = document.createElement('iframe');

      iframe.setAttribute('src', this.profile.promo_video);
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allowfullscreen', 'true');
      iframe.setAttribute('class', 'creatorOverview__iframe');

      this.elementRef.nativeElement.querySelector('.js-creatorOverview__video').appendChild(iframe);
    }
  }

  @HostBinding('class') get classStr() {
    return 'creatorOverview section';
  }

}
