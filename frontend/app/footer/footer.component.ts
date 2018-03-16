import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'vh-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  getCopyright() {
    return `© ${new Date().getFullYear()} yousource.io`;
  }

}
