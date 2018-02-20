import { Component, HostBinding, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { ApiService } from "../api.service";
import { DomSanitizer } from "@angular/platform-browser";
let golos = require('golos-js');

@Component({
  selector: 'vh-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class PostPageComponent implements OnInit {

  constructor(
    public activatedRoute: ActivatedRoute,
    public api: ApiService,
    public router: Router,
    public sanitizer: DomSanitizer
  ) { }

  post: any;

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      /**
       * getContent() receiving a post
       * @param {String} author - author of the post
       * @param {String} permlink - url-address of the post
       */
      //let author = 'votehunter';
      //let permlink = 'super-video';

      let author = params.a;
      let permlink = params.p;
      golos.api.getContent(author, permlink, (err, post) => {
        if (!err) {
          console.log(post);
          let postData = {
            author: author,
            permlink: permlink,
            body: post.body,
            metadata: post.json_metadata
          };
          this.api.postShow(postData).then((data) => {
            if(data.status == 'ok') {
              delete postData.metadata;
              postData['title'] = post.title;
              postData['body'] = data.post.body;
              postData['id'] = data.post.id;
              if(data.post.video_url) {
                postData['video_url'] = data.post.video_url;
              }
            }

            console.log(postData);
            this.post = postData;
          });
        }
        else console.error(err);
      });

    });
  }

  pay() {
    this.router.navigateByUrl('/payment?id=' + this.post.id);
  }

  @HostBinding('class') get classStr() {
    return 'postPage bg1';
  }

  getVideoID() {
    return this.post.video_url.substr(this.post.video_url.indexOf('?v=') + 3);
  }

}
