///<reference path="../../../node_modules/@angular/core/src/metadata/directives.d.ts"/>
import {Component, OnInit} from '@angular/core';
import {ApiService} from '../api.service';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '../user.service';
import {DOMService} from '../dom.service';

let moment = require('moment');

let steem = require('steem');
steem.config.set('websocket', 'wss://testnet.steem.vc');
steem.config.set('uri', 'https://testnet.steem.vc');
steem.config.set('address_prefix', 'STX');
steem.config.set('chain_id', '79276aea5d4877d9a25892eaa01b0adf019d3e5cb12a97478df3298ccdd01673');

@Component({
    selector: 'vh-creator-community',
    templateUrl: './creator-community.component.html',
    styleUrls: ['./creator-community.component.less', '../creator-page/creator-page.component.less']
})
export class CreatorCommunityComponent implements OnInit {
    profile: any;
    isPatron?: boolean;
    posts: any;
    POST_PRIVACY: any;
    errors: any;
    postData = {
        title: '',
        body: '',
        privacy: 0,
        jsonMetadata: {
            tags: ['usource','nsfw'],
            app: 'usource.ru',
            author_avatar: '/images/ava_placeholder.svg',
            privacy: 0,
        },
        parentPermlink: '',
        permlink: '',
    };
    postsLimit = 30;
    constructor(
        public api: ApiService,
        public user: UserService,
        private route: ActivatedRoute,
        public domService: DOMService,
    ) {
    }

    ngOnInit() {
        this.profile = this.route.snapshot.data.profile.profile;
        this.isPatron = this.route.snapshot.data.profile.isPatron;

        this.posts = [
            /*
                        {
                            author: "Name Vasya",
                            title : 'Hello! Blabla bls!',
                            body  : 'Lodjds eue kbew 83nklj3n ks @j3k 0!=1 K2 3kj392  ad.asd.asd qw.qw.eq/qweqw',
                            //date: moment(comment.created).fromNow(),
                            date: 'Just now',
                            profile_image: '/images/ava_placeholder.svg',
                        },
                        {
                            author: "Name Vasya",
                            title : 'Hello! Blabla bls!',
                            body  : 'Lodjds eue kbew 83nklj3n ks @j3k 0!=1 K2 3kj392  ad.asd.asd qw.qw.eq/qweqw',
                            //date: moment(comment.created).fromNow(),
                            date: 'Just now',
                            profile_image: '/images/ava_placeholder.svg',
                        },
                        {
                            author: "Name Vasya",
                            title : 'Hello! Blabla bls!',
                            body  : 'Lodjds eue kbew 83nklj3n ks @j3k 0!=1 K2 3kj392  ad.asd.asd qw.qw.eq/qweqw',
                            //date: moment(comment.created).fromNow(),
                            date: 'Just now',
                            profile_image: '/images/ava_placeholder.svg',
                        },
            */
        ];
        this.getPosts();
        this.api.getPostPrivacyValues({community: 1}).then(
            (data) => {
                this.POST_PRIVACY = data.privacy;
            },
            (data) => {

            }
        );

    }

    validateForm() {
        this.errors = [];
        if (this.postData.body == '') {
            this.errors.push('Cannot add ampty post');
        }
        return this.errors.length == 0;
    }

    makePost(event) {
        let promise = new Promise((resolve, reject) => {
            let postingKey = steem.auth.toWif(localStorage.getItem('nick'), localStorage.getItem('password'), 'posting');
            if (!this.validateForm()) {
                reject();
                return false;
            }
            this.postData.jsonMetadata.tags = ['usource','nsfw', this.profile.community_permlink];
            this.postData.jsonMetadata.author_avatar = this.user.profile_image;
            this.postData.jsonMetadata.privacy = this.postData.privacy;
            let wif = localStorage.getItem('privKey');
            let parentAuthor = '';
            let parentPermlink = this.profile.community_permlink;
            let author = localStorage.getItem('nick');
            let permlink = steem.formatter.commentPermlink(localStorage.getItem('nick'), parentPermlink);
            let title = this.postData.title;
            let body = this.postData.body;
            let jsonMetadata = JSON.stringify(this.postData.jsonMetadata);
            if(this.postData.jsonMetadata.privacy > 0) {
                let data = {
                    title: title,
                    body: body,
                    author: author,
                    permlink: permlink,
                    pKey: postingKey,
                };
                this.api.encryptPost(data).then((data) => {
                    this.postData.jsonMetadata['encodedData'] = data.strEncryptedData;
                    this.postData.jsonMetadata['encKey'] = data.strEncKey;
                    let jsonMetadata = JSON.stringify(this.postData.jsonMetadata);
                    let origTitle = title;
                    let origBody = body;
                    title = '[hidden]';
                    body = '[hidden]';
                    this.postToSteemit(postingKey, parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata, resolve, reject, origTitle, origBody);
                }, (data) => {
                    reject();
                });
            } else {
                this.postToSteemit(postingKey, parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata, resolve, reject);
            }


            // steem.broadcast.comment(postingKey, parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata, (err, result) => {
            //     if (err) {
            //         reject();
            //         this.errors = ['Timeout limit'];
            //     } else {
            //         this.posts.unshift(
            //             {
            //                 author: author,
            //                 body: body,
            //                 title: title,
            //                 date: moment(moment().format(), 'YYYY-MM-DDThh:mm:ss').fromNow(),
            //                 profile_image: this.user.profile_image,
            //                 parentPermlink: parentPermlink,
            //                 permlink: permlink,
            //             }
            //         );
            //         this.postData = {
            //             title: '',
            //             body: '',
            //             privacy: 0,
            //             jsonMetadata: {
            //                 tags: ['usource','nsfw'],
            //                 app: 'usource.ru',
            //                 author_avatar: '/images/ava_placeholder.svg',
            //                 privacy: 0,
            //             },
            //             parentPermlink: '',
            //             permlink: '',
            //
            //         };
            //
            //
            //         resolve();
            //     }
            // });
        });

        this.domService.onFormSubmit(event.target, promise);


    }

    postToSteemit(postingKey, parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata, resolve, reject, origTitle?, origBody?) {
        steem.broadcast.comment(postingKey, parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata, (err, result) => {
            if (err) {
                reject();
                this.errors = ['Timeout limit'];
            } else {
                this.posts.unshift(
                    {
                        author: author,
                        body: origBody || body,
                        title: origTitle|| title,
                        date: moment(moment().format(), 'YYYY-MM-DDThh:mm:ss').fromNow(),
                        profile_image: this.user.profile_image,
                        parentPermlink: parentPermlink,
                        permlink: permlink,
                    }
                );
                this.postData = {
                    title: '',
                    body: '',
                    privacy: 0,
                    jsonMetadata: {
                        tags: ['usource','nsfw'],
                        app: 'usource.ru',
                        author_avatar: '/images/ava_placeholder.svg',
                        privacy: 0,
                    },
                    parentPermlink: '',
                    permlink: '',

                };
                resolve();
            }
        });

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

    makePermLink(nick?) {
    }

    getPosts() {
        let promise = new Promise((resolve, reject) => {
            this.posts = [];
            //steem.api.getDiscussionsByCreated({ tag: this.profile.community_permlink, start_permlink: this.profile.community_permlink, limit: this.postsLimit}, (err, result) => {

            //steem.api.getDiscussionsByTrending({tag: this.profile.community_permlink, limit: this.postsLimit}, (err, result) => {
            steem.api.getDiscussionsByCreated({tag: this.profile.community_permlink, limit: this.postsLimit}, (err, result) => {
                if (err) {
                    reject();
                }
                if (result) {
                    let tmpAuthors = [];
                    result.forEach((post) => {
                        console.log(post);
                        let comments = [];
                        if(post.replies.length > 0) {
                            comments = this.getPostComments(post);
                        }
                        let jsonData = JSON.parse(post.json_metadata);
                        if(jsonData.privacy > 0) {
                            let data = {
                              author: post.author,
                              permlink: post.permlink,
                              encodedData: jsonData.encodedData,
                            };
                            this.api.decryptPost(data).then((data) => {
                                this.posts.push(
                                    {
                                        author: post.author,
                                        body: data.body,
                                        title: data.title,
                                        date: moment(post.created).fromNow(),
                                        profile_image: '/images/ava_placeholder.svg',
                                        comments: comments,
                                        permlink: post.permlink,
                                    }
                                );

                            }, (data) => {

                            })
                        } else {
                            this.posts.push(
                                {
                                    author: post.author,
                                    body: post.body,
                                    title: post.title,
                                    //date: moment(comment.created, 'YYYY-MM-DDThh:mm:ss').fromNow(),
                                    date: moment(post.created).fromNow(),
                                    profile_image: '/images/ava_placeholder.svg',
                                    comments: comments,
                                    permlink: post.permlink,
                                }
                            );
                        }
                        tmpAuthors.push(post.author);
                    });
                    this.api.getAvatars({authors: Array.from(new Set(tmpAuthors))}).then((data) => {
                        this.posts.forEach((post) => {
                            if(data.avatars[post.author]) {
                                post.profile_image = data.avatars[post.author];
                            }
                        });
                    }, (data) => {

                    })
                }
            });
        });
    }

    getPostComments(post) {
        let comments = [];
        post.replies.forEach((comment) => {
            let data = JSON.parse(comment.json_metadata);
            comments.push(
                {
                    permlink: comment.permlink,
                    author: comment.author,
                    comment: comment.body,
                    date: moment(comment.created).fromNow(),
                    profile_image: data.author_avatar ? data.author_avatar : '/images/ava_placeholder.svg',
                }
            );
        });
        return comments;

    }



}
