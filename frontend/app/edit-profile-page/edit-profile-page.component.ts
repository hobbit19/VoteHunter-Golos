import { Component, HostBinding, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'vh-edit-profile-page',
  templateUrl: './edit-profile-page.component.html',
  styleUrls: ['./edit-profile-page.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class EditProfilePageComponent implements OnInit {

  categories: any[];
  profile: any [];
  constructor(
      public api: ApiService,
      ) {
  }

  ngOnInit() {
      console.log('333');
      this.getCategoriesList();
      this.getProfile();

  }

  @HostBinding('class') get classStr() {
    return 'editProfilePage';
  }

  getCategoriesList() {
      this.api.getCategories().then((data) => {
          this.categories = data.cats;
      })
  }

  getProfile() {
      this.api.getProfile().then((data) => {
          this.profile = data.profile;
          console.log(this.profile);
      }, (data) => {
         //show data.msg
      });
  }


  selectedCategory = this.categories[0];

}
