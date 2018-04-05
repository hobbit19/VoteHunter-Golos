import {Component, HostBinding, OnInit, ViewEncapsulation} from '@angular/core';
import {ApiService} from '../api.service';
import {Router} from '@angular/router';
import {DOMService} from '../dom.service';

let golos = require('golos-js');

let steem = require('steem');
steem.config.set('websocket','wss://testnet.steem.vc');
steem.config.set('uri','https://testnet.steem.vc');
steem.config.set('address_prefix', 'STX');
steem.config.set('chain_id', '79276aea5d4877d9a25892eaa01b0adf019d3e5cb12a97478df3298ccdd01673');
let APIS = {
    steem: steem,
    golos: golos,
};

// const POST_PRIVACY = [
//   { str: 'Supporters only', value: 1 },
//   { str: 'Public', value: 0 },
// ];

const POST_CONTENT_TYPES = [
  {str: 'Video', value: 1},
];

@Component({
  selector: 'vh-add-post-page',
  templateUrl: './add-post-page.component.html',
  styleUrls: ['./add-post-page.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class AddPostPageComponent implements OnInit {

  constructor(public api: ApiService,
              public router: Router,
              public domService: DOMService) {
  }

  POST_PRIVACY: any;
  POST_CONTENT_TYPES = POST_CONTENT_TYPES;

  postData = {
    title: '',
    body: '',
    video_url: '',
    patrons_only: 0,
    cat_id: POST_CONTENT_TYPES[0].value,
    pKey: '',
    video_file: null,
  };

  ngOnInit() {
    this.api.getPostPrivacyValues().then(
      (data) => {
        this.POST_PRIVACY = data.privacy;
      },
      (data) => {

      }
    );
  }

  findByProp(arr, prop, val) {
    let result;
    if (!arr || arr.length === 0) {
      return result;
    }
    arr.forEach((elem) => {
      if (elem[prop] === val) {
        result = elem;
      }
    });

    return result;
  }

  @HostBinding('class') get classStr() {
    return 'addPostPage';
  }

  errors = [];

  post(event) {
    let promise = new Promise((resolve, reject) => {
      let postingKey = APIS['steem'].auth.toWif(localStorage.getItem('nick'), localStorage.getItem('password'), 'posting');
      this.postData.pKey = postingKey;
      this.api.postAdd(this.postData).then((data) => {
        if (!data.status || data.status !== 'ok') {
          reject();

          return;
        }

        let wif = localStorage.getItem('privKey');
        let parentAuthor = '';
        let parentPermlink = data.data.parentPermlink;
        let author = data.data.author;
        let permlink = data.data.permlink;
        let title = data.data.title;
        let body = data.data.body;
        let jsonMetadata = JSON.stringify(data.data.jsonMetadata);

        APIS['steem'].broadcast.comment(postingKey, parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata, (err, result) => {
          if (err) {
            reject();

            this.errors = ['Timeout limit'];
          } else {
            resolve();
            this.router.navigateByUrl(data.data.post_link);
          }
        });
      });
    });

    this.domService.onFormSubmit(event.target, promise);
  }

  clearErrors() {
    this.errors = [];
  }

  onFileInputChange($event) {
      let files = $event.target.files;
      for (let i = 0, f; f = files[i]; i++) {
          if (!f.type.match('video.*')) {
              continue;
          }
          let reader = new FileReader();
          reader.onload = ((theFile) => {
              return (e) => {
                  document.getElementById('new_video_file').innerHTML = 'File: ' + theFile.name + ', Size: ' + theFile.size + ' bytes.';
                  this.postData.video_file = f;
                  (document.getElementById('video_url') as HTMLInputElement).readOnly = true;
                  (document.getElementById('video_url') as HTMLInputElement).value = '';
                  this.postData.video_url = '';
              };
          })(f);
          reader.readAsDataURL(f);
      }
  }

  cleanVideoFile()
  {
      document.getElementById('new_video_file').innerText = 'Click to select video to upload';
      (document.getElementById('new_video_file_input') as HTMLInputElement).value = '';
      (document.getElementById('video_url') as HTMLInputElement).readOnly = false;
      this.postData.video_file = null;
  }

}
