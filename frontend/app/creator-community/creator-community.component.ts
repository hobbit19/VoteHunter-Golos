///<reference path="../../../node_modules/@angular/core/src/metadata/directives.d.ts"/>
import {Component, OnInit} from '@angular/core';
import {ApiService} from '../api.service';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '../user.service';

@Component({
    selector: 'vh-creator-community',
    templateUrl: './creator-community.component.html',
    styleUrls: ['./creator-community.component.less', '../creator-page/creator-page.component.less']
})
export class CreatorCommunityComponent implements OnInit {
    profile: any;
    isPatron?: boolean;
    posts: any;

    constructor(
        public api: ApiService,
        public user: UserService,
        private route: ActivatedRoute
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
        ]
    }

}
