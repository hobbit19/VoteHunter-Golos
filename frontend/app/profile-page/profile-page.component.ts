import { Component, HostBinding, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'vh-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class ProfilePageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @HostBinding('class') get classStr() {
    return 'profilePage bg1';
  }

  categories = [
    { name: 'Блокчейн' },
    { name: 'Инвестиции' },
    { name: 'Путешествия' },
    { name: 'Образование' },
    { name: 'Фотография' },
  ];

  selectedCategory = this.categories[0];

}
