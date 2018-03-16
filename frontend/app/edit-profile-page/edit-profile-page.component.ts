import { Component, HostBinding, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../api.service';
import {DOMService} from '../dom.service';


@Component({
  selector: 'vh-edit-profile-page',
  templateUrl: './edit-profile-page.component.html',
  styleUrls: ['./edit-profile-page.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class EditProfilePageComponent implements OnInit {

  categories: any[];
  profile: any;
  goals: any;
  rewards: any;
  selectedCategory: any;
  new_cover_image: any;
  new_profile_image: any;
  new_list_image: any;

  constructor(
      public api: ApiService,
      public domService: DOMService,
      ) {
  }

  ngOnInit() {
      this.getProfile();
  }

  @HostBinding('class') get classStr() {
    return 'editProfilePage';
  }

  submit() {
      if(this.selectedCategory.id != 0) {
          this.profile.cat_id = this.selectedCategory.id;
      }
      let data = {
          profile: JSON.stringify(this.profile)
      }
      if(this.new_profile_image) {
          data['new_profile_image'] = this.new_profile_image;
      }
      if(this.new_cover_image) {
          data['new_cover_image'] = this.new_cover_image;
      }
      if(this.new_list_image) {
          data['new_list_image'] = this.new_list_image;
      }
      this.api.updateProfile(data).then((data) => {

      }, (data) => {

      });
  }

  submitGoals () {
      this.api.updateGoals(this.goals[0]).then((data) => {
            //do something
      }, (data) => {
            console.log(data.msg);
      });
  }

  submitReward(i) {
      this.api.updateReward(this.rewards[i]).then((data) => {
          //do something
      }, (data) => {
          console.log(data.msg);
      });

  }

  addReward() {
      this.rewards.push({
          amount: 0.0,
          reward: '',
      })
  }

  delReward (i) {
    if(confirm('Вы уверены?')) {

    }
  }


    getCategoriesList() {
      this.api.getCategories().then((data) => {
          this.categories = data.cats;
          if(this.profile.cat_id == 0) {
              this.selectedCategory = {
                  id: 0,
                  name: 'Не выбрано'
              };
          } else {
              this.selectedCategory = this.categories[this.profile.cat_id];
          }
      })
  }

  getProfile() {
      this.api.getProfile().then((data) => {
          this.profile = data.profile;
          this.goals = data.goals;
          this.rewards = data.rewards
          this.getCategoriesList();
          if(this.profile.contents) {

          }
      }, (data) => {
         //show data.msg
      });
  }
  onAvaInputChange($event) {
      let files = $event.target.files;
      for (let i = 0, f; f = files[i]; i++) {
          if (!f.type.match('image.*')) {
              continue;
          }
          let reader = new FileReader();
          reader.onload = ((theFile) => {
              return (e) => {
                  document.getElementById('new_profile_image').style.backgroundImage = 'url(' + e.target.result + ')';
                  this.new_profile_image = f;
              };
          })(f);
          reader.readAsDataURL(f);
      }
  }
  onCoverInputChange($event) {
      let files = $event.target.files;
      for (let i = 0, f; f = files[i]; i++) {
          if (!f.type.match('image.*')) {
              continue;
          }
          let reader = new FileReader();
          reader.onload = ((theFile) => {
              return (e) => {
                  document.getElementById('new_cover_image').style.backgroundImage = 'url(' + e.target.result + ')';
                  this.new_cover_image = f;
              };
          })(f);
          reader.readAsDataURL(f);
      }
  }
    onListInputChange($event) {
      let files = $event.target.files;
      for (let i = 0, f; f = files[i]; i++) {
          if (!f.type.match('image.*')) {
              continue;
          }
          let reader = new FileReader();
          reader.onload = ((theFile) => {
              return (e) => {
                  document.getElementById('new_list_image').style.backgroundImage = 'url(' + e.target.result + ')';
                  this.new_list_image = f;
              };
          })(f);
          reader.readAsDataURL(f);
      }
  }

  onTextChanged(event) {
    this.profile.description = event.html;
    this.profile.contents = event.contents;
  }

}
