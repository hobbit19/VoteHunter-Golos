import { Component, HostBinding, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'vh-edit-profile-page',
  templateUrl: './edit-profile-page.component.html',
  styleUrls: ['./edit-profile-page.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class EditProfilePageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @HostBinding('class') get classStr() {
    return 'editProfilePage bg1';
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
