import { Component, HostBinding, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import {DOMService} from '../dom.service';
let golos = require('golos-js');

const POST_PRIVACY = [
  { str: 'Patrons only', value: 1 },
  { str: 'Public', value: 0 },
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
    public router: Router,
    public domService: DOMService
  ) { }

  POST_PRIVACY = POST_PRIVACY;
  POST_CONTENT_TYPES = POST_CONTENT_TYPES;

  postData = {
    title: '',
    body: '',
    video_url: '',
    patron_only: POST_PRIVACY[0].value,
    cat_id: POST_CONTENT_TYPES[0].value,
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

  post(event) {
    let promise = new Promise((resolve, reject) => {
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

        golos.broadcast.comment(wif, parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata, (err, result) => {
          if (err) {
            reject();

            this.errors = ["Timeout limit"];
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

}
