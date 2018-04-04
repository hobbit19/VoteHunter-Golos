import {Component, HostBinding, OnInit, ViewEncapsulation} from '@angular/core';
import {ApiService} from '../api.service';
import {DOMService} from '../dom.service';

let golos = require('golos-js');
golos.config.set('websocket', 'wss://ws.testnet3.golos.io');
golos.config.set('chain_id', '5876894a41e6361bde2e73278f07340f2eb8b41c2facd29099de9deef6cdb679');

let steem = require('steem');
steem.config.set('websocket','wss://testnet.steem.vc');
steem.config.set('address_prefix', 'STX');
steem.config.set('chain_id', '79276aea5d4877d9a25892eaa01b0adf019d3e5cb12a97478df3298ccdd01673');

let APIS = {
    steem: steem,
    golos: golos,
};


@Component({
  selector: 'vh-edit-profile-page',
  templateUrl: './edit-profile-page.component.html',
  styleUrls: ['./edit-profile-page.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class EditProfilePageComponent implements OnInit {
  categories: any[];
  profile: any;
  json_metadata: any;
  goals: any;
  rewards: any;
  selectedCategory: any;
  new_cover_image: any;
  new_profile_image: any;
  new_list_image: any;

  constructor(public api: ApiService,
              public domService: DOMService,) {
  }
  ngOnInit() {
    this.getProfile();
  }

  @HostBinding('class') get classStr() {
    return 'editProfilePage';
  }


  submit(event) {


    if (this.selectedCategory.id != 0) {
      this.profile.cat_id = this.selectedCategory.id;
    }
    let data = {
      profile: JSON.stringify(this.profile)
    }
    if (this.new_profile_image) {
      data['new_profile_image'] = this.new_profile_image;
    }
    if (this.new_cover_image) {
      data['new_cover_image'] = this.new_cover_image;
    }
    if (this.new_list_image) {
      data['new_list_image'] = this.new_list_image;
    }
    this.domService.onFormSubmit(event.target, this.api.updateProfile(data).then((data) =>{
        let dataJson = this.json_metadata;
        dataJson['yousource'] = this.profile;
        delete(dataJson['yousource']['contents']);
        this.updateBCData(dataJson);
    }, () => true));
  }

  updateBCData(dataJson)
  {
      let wif = APIS['steem'].auth.toWif(localStorage.getItem('nick'), localStorage.getItem('password'), 'owner');
      let keys = APIS['steem'].auth.getPrivateKeys(localStorage.getItem('nick'), localStorage.getItem('password'));
      let owner = {
          weight_threshold: 1,
          account_auths: [],
          key_auths: [[keys.ownerPubkey, 1]]
      };
      let active = {
          weight_threshold: 1,
          account_auths: [],
          key_auths: [[keys.activePubkey, 1]]
      };
      let posting = {
          weight_threshold: 1,
          account_auths: [],
          key_auths: [[keys.postingPubkey, 1]]
      };
      let memoKey = keys.memoPubkey;
      APIS['steem'].broadcast.accountUpdate(wif, localStorage.getItem('nick'), owner, active, posting, memoKey, JSON.stringify(dataJson), function(err, result) {
          console.log(err, result);
      });

  }

  submitGoals(event) {
    this.domService.onFormSubmit(event.target, this.api.updateGoals(this.goals[0]).then((data) => {
        let dataJson = this.json_metadata;
        if(dataJson.goals) {
            dataJson['goals'][data.goal.id] = data.goal;
        } else {
            dataJson['goals'] = {};
            dataJson['goals'][data.goal.id] = data.goal;
        }
        this.updateBCData(dataJson);
    }, () => true));
  }

  submitReward(event, i) {
    this.domService.onFormSubmit(event.target, this.api.updateReward(this.rewards[i]).then((data) => {
        let dataJson = this.json_metadata;
        if(dataJson.rewards) {
            dataJson['rewards'][data.reward.id] = data.reward;
        } else {
            dataJson['rewards'] = {};
            dataJson['rewards'][data.reward.id] = data.reward;
        }
        this.updateBCData(dataJson);

    }, () => true));
  }

  addReward() {
    this.rewards.push({
      amount: 0.0,
      reward: '',
      title: '',
    })
  }

  delReward(i) {
    if (confirm('Are you sure?')) {

    }
  }


  getCategoriesList() {
    this.api.getCategories().then((data) => {
      this.categories = data.cats;
      if (this.profile.cat_id == 0) {
        this.selectedCategory = {
          id: 0,
          name: 'Not chosen'
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
      this.rewards = data.rewards;
      this.json_metadata = data.json_metadata;
      this.getCategoriesList();
      if (this.profile.contents) {

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
