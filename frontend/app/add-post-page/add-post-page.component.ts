import { Component, HostBinding, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
let golos = require('golos-js');

const POST_PRIVACY = [
  { str: 'Patrons only', value: 1 },
  { str: 'Public', value: 2 },
];

const POST_CONTENT_TYPES = [
  { str: 'Video', value: 1 },
];

@Component({
  selector: 'vh-add-post-page',
  templateUrl: './add-post-page.component.html',
  styleUrls: ['./add-post-page.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class AddPostPageComponent implements OnInit {

  constructor(
    public api: ApiService,
    public router: Router
  ) { }

  POST_PRIVACY = POST_PRIVACY;
  POST_CONTENT_TYPES = POST_CONTENT_TYPES;

  postData = {
    title: '',
    body: '',
    video_url: '',
    privacy: POST_PRIVACY[0].value,
    type: POST_CONTENT_TYPES[0].value,
  };

  ngOnInit() {
  }

  findByProp(arr, prop, val) {
    let result;

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

  post() {
    this.api.postAdd(this.postData).then((data) => {
      if (!data.status) { return; }
      if (data.status != 'ok') { return; }

      let wif = localStorage.getItem('privKey');
      let parentAuthor = '';
      let parentPermlink = 'test';
      let author = data.data.author;
      let permlink = data.data.permlink;
      let title = data.data.title;
      let body = data.data.body;
      let jsonMetadata = JSON.stringify(data.data.jsonMetadata);

      golos.broadcast.comment(wif, parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata, (err, result) => {
        if (err) {
          console.log(err);

          this.errors = ["Timeout limit"];
        } else {
          this.router.navigateByUrl(data.data.post_link);
        }
      });
    });
  }

  clearErrors() {
    this.errors = [];
  }

}
