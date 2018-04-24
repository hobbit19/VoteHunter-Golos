import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {UserService} from '../user.service';
import {DOMService} from '../dom.service';
import {ApiService} from '../api.service';
import {Router} from '@angular/router';

let moment = require('moment');
let steem = require('steem');
steem.config.set('websocket', 'wss://testnet.steem.vc');
steem.config.set('uri', 'https://testnet.steem.vc');
steem.config.set('address_prefix', 'STX');
steem.config.set('chain_id', '79276aea5d4877d9a25892eaa01b0adf019d3e5cb12a97478df3298ccdd01673');

@Component({
    selector: 'vh-post-comments',
    templateUrl: './post-comments.component.html',
    styleUrls: ['./post-comments.component.less', '../post-page/post-page.component.less', '../video/video.less', '../persons/persons.component.less', '../section.less']
})

export class PostCommentsComponent implements OnInit {
    @Input() post: any;
    @Input() comments_per_page: any;
    comments: any;
    comments_visible: any;
    comments_visible_cnt: number;
    comments_cnt_str: string;
    comment_text: string;

    //comments_per_page = 4;

    constructor(
        public domService: DOMService,
        public user: UserService,
        public api: ApiService,
        private router: Router,
    ) {
        this.comments_visible_cnt = 0;
        this.comments_visible = [];
    }

    ngOnInit() {
        this.getComments();
    }

    @HostBinding('class') get classStr() {
        return 'postComments';
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
                                profile_image: '/images/ava_placeholder.svg',
                            }
                        );
                        tmpAuthors.push(comment.author);
                    });
                    this.api.getAvatars({authors: Array.from(new Set(tmpAuthors))}).then((data) => {
                        this.comments.forEach((comment) => {
                            if(data.avatars[comment.author]) {
                                comment.profile_image = data.avatars[comment.author];
                            }
                        });
                        this.showComments();
                    }, (data) => {

                    })
                }
            });
        });
    }

    postComment(event) {
        let promise = new Promise((resolve, reject) => {
            let postingKey = steem.auth.toWif(localStorage.getItem('nick'), localStorage.getItem('password'), 'posting');

            let parentAuthor = this.post.author;
            let parentPermlink = this.post.permlink;
            let author = localStorage.getItem('nick');
            let permlink = steem.formatter.commentPermlink(parentAuthor, parentPermlink);
            let title = this.comment_text;
            let body = this.comment_text;
            let jsonMetadata = JSON.stringify([]);

            steem.broadcast.comment(postingKey, parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata, (err, result) => {
                if (err) {
                    console.log(err);
                    //this.errors = ['Timeout limit'];
                    reject();
                    return false;
                } else {
                    this.comments_visible.push({
                        author: author,
                        comment: this.comment_text,
                        date: moment(moment().format(), 'YYYY-MM-DDThh:mm:ss').fromNow(),
                        profile_image: this.user.profile_image,
                    });
                    this.comment_text = '';
                    this.comments_cnt_str = this.comments_visible_cnt + ' of ' + this.comments.length;
                    resolve();
                }
            });
        });

        this.domService.onFormSubmit(event.target, promise);
    }

    showComments() {
        if(this.comments_visible.length >= this.comments_per_page * 2 && this.comments_per_page < 10) {
            this.router.navigateByUrl(this.post.link);
        }
        let i = 0;
        let curLen = this.comments_visible.length;
        for (i = curLen; i < this.comments.length && i < curLen + this.comments_per_page; i++) {
            this.comments_visible.push(this.comments[i]);
        }
        this.comments_visible_cnt = this.comments_visible.length;
        this.comments_cnt_str = '' + this.comments_visible.length + ' of ' + this.comments.length;
    }

}
