import {Component, ElementRef, HostBinding, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '../api.service';
import {DomSanitizer} from '@angular/platform-browser';
import {DOMService} from '../dom.service';
import {reject} from 'q';
import {forEach} from '@angular/router/src/utils/collection';
import {UserService} from '../user.service';

let moment = require('moment');

let golos = require('golos-js');
golos.config.set('websocket', 'wss://ws.testnet3.golos.io');
golos.config.set('chain_id', '5876894a41e6361bde2e73278f07340f2eb8b41c2facd29099de9deef6cdb679');

let steem = require('steem');
steem.config.set('websocket', 'wss://testnet.steem.vc');
steem.config.set('uri', 'https://testnet.steem.vc');
steem.config.set('address_prefix', 'STX');
steem.config.set('chain_id', '79276aea5d4877d9a25892eaa01b0adf019d3e5cb12a97478df3298ccdd01673');

let APIS = {
    steem: steem,
    golos: golos,
};


interface IPost {
    author: string,
    permlink: string,
    json_metadata: string,
    body?: string,
    title?: string,
    id?: string,
    video_url?: string,
    video_ipfs?: string,
    post_image?: string,
    tags: any,
    isLocked?: boolean,
    user_id: number,
    price_usd: number,
    patrons_only?: number,
}

@Component({
    selector: 'vh-post-page',
    templateUrl: './post-page.component.html',
    styleUrls: ['./post-page.component.less', '../video/video.less', '../persons/persons.component.less', '../section.less', '../creator-page/creator-page.component.less', '../creator-posts/creator-posts.component.less'],
    encapsulation: ViewEncapsulation.None
})
export class PostPageComponent implements OnInit {
    prepareData: any;

    constructor(
        public activatedRoute: ActivatedRoute,
        public api: ApiService,
        public router: Router,
        public sanitizer: DomSanitizer,
        public elementRef: ElementRef,
        public domService: DOMService,
        public user: UserService,
    ) {
    }

    post: IPost;
    comments: any;
    comments_cnt_str: string;
    comment_text: string;
    profile: any;
    isPatron: any;

    ngOnInit() {

        this.activatedRoute.params.subscribe(params => {
            /**
             * getContent() receiving a post
             * @param {String} author - author of the post
             * @param {String} permlink - url-address of the post
             */
            let author = this.activatedRoute.snapshot.data.prepareData.nick;
            let permlink = params.permlink;

            this.api.getProfileByUrl(this.activatedRoute.snapshot.data.prepareData.url).then((data) => {
                    this.profile = data.profile;
                    this.isPatron = data.isPatron;
                },
                (data) => {

                }
            );
            this.api.getPostContent(author, permlink, this.getPostContent.bind(this));

/*
            APIS['steem'].api.getContent(author, permlink, (err, post) => {
                if (!err) {
                    let postData: IPost = {
                        author: author,
                        permlink: permlink,
                        body: post.body,
                        metadata: post.json_metadata
                    };

                    this.api.postShow(postData).then((data) => {
                        if (data.status == 'ok') {
                            delete postData.metadata;
                            postData.title = post.title;
                            postData.body = data.post.body;
                            postData.id = data.post.id;
                            postData.post_image = data.post.post_image;
                            if (data.post.video_url) {
                                postData.video_url = data.post.video_url;
                            }
                            if (data.post.video_ipfs) {
                                postData.video_ipfs = data.post.video_ipfs;
                            }
                        }
                        this.post = postData;
                        this.getComments();
                    });
                } else {
                    console.error(err);
                }
            });
*/

        });
    }

    getPostContent(postData) {
        this.post = postData;
        let json_metadata = JSON.parse(postData.json_metadata);
        this.post.tags = json_metadata['tags'].slice(1);
        this.getComments();
    }
    
    getVideoSrc() {
        return 'https://www.youtube.com/embed/' + this.getVideoID();
    }

    pay() {
        this.router.navigateByUrl('/payment?id=' + this.post.id);
    }

    @HostBinding('class') get classStr() {
        return 'postPage';
    }

    getVideoID() {
        return this.post.video_url.substr(this.post.video_url.indexOf('?v=') + 3);
    }

    playVideo($event) {
        let target = $event.target || $event.srcElement;
        let videoId = target.id.replace('play-', '');
        let video = (document.getElementById(videoId) as HTMLVideoElement);
        video.setAttribute('controls', 'controls');
        video.play();
        video.onplaying = () => {
            (document.getElementById(target.id) as HTMLElement).style.display = 'none';
        };
        video.onpause = () => {
            (document.getElementById(target.id) as HTMLElement).style.display = 'block';
        };

        //target.style.display = 'none';
    }

    videoClick($event) {
        let target = $event.target || $event.srcElement;
        target.pause();
        (document.getElementById('play-' + target.id) as HTMLElement).style.display = 'block';
    }

    getComments() {
        let promise = new Promise((resolve, reject) => {
            let parent = this.post.author;
            let parentPermlink = this.post.permlink;
            this.comments = [];
            steem.api.getContentReplies(parent, parentPermlink, (err, result) => {
                if (err) {
                    reject();
                }
                if (result) {
                    let tmpAuthors = [];
                    result.forEach((comment) => {
                        this.comments.push(
                            {
                                author: comment.author,
                                comment: comment.body,
                                //date: moment(comment.created, 'YYYY-MM-DDThh:mm:ss').fromNow(),
                                date: moment(comment.created).fromNow(),
                                profile_image: ''
                            }
                        );
                        tmpAuthors.push(comment.author);
                    });
                    this.comments_cnt_str = '4 of ' + this.comments.length;
                    this.api.getAvatars({authors: Array.from(new Set(tmpAuthors))}).then((data) => {
                        this.comments.forEach((comment) => {
                            comment.profile_image = data.avatars[comment.author];
                        });
                    }, (data) => {

                    })
                }
            });
        });
    }

    postComment(event) {
        let promise = new Promise((resolve, reject) => {
            let postingKey = APIS['steem'].auth.toWif(localStorage.getItem('nick'), localStorage.getItem('password'), 'posting');

            let parentAuthor = this.post.author;
            let parentPermlink = this.post.permlink;
            let author = localStorage.getItem('nick');
            let permlink = steem.formatter.commentPermlink(parentAuthor, parentPermlink);
            let title = this.comment_text;
            let body = this.comment_text;
            let jsonMetadata = JSON.stringify([]);

            APIS['steem'].broadcast.comment(postingKey, parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata, (err, result) => {
                if (err) {
                    console.log(err);
                    //this.errors = ['Timeout limit'];
                    reject();
                    return false;
                } else {
                    this.comments.push({
                        author: author,
                        comment: this.comment_text,
                        date: moment(moment().format(), 'YYYY-MM-DDThh:mm:ss').fromNow(),
                        profile_image: this.user.profile_image,
                    });
                    this.comment_text = '';
                    this.comments_cnt_str = '4 of ' + this.comments.length;
                    resolve();
                }
            });
        });

        this.domService.onFormSubmit(event.target, promise);
    }


}
