import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MediatorService} from '../mediator.service';
import {ApiService} from '../api.service';

let golos = require('golos-js');
golos.config.set('websocket', 'wss://ws.testnet3.golos.io');
golos.config.set('chain_id', '5876894a41e6361bde2e73278f07340f2eb8b41c2facd29099de9deef6cdb679');

let steem = require('steem');
steem.config.set('websocket', 'wss://testnet.steem.vc');
steem.config.set('uri', 'https://testnet.steem.vc');
steem.config.set('address_prefix', 'STX');
steem.config.set('chain_id', '79276aea5d4877d9a25892eaa01b0adf019d3e5cb12a97478df3298ccdd01673');


@Component({
  selector: 'vh-become-patron-page',
  templateUrl: './become-patron-page.component.html',
  styleUrls: ['./become-patron-page.component.less']
})
export class BecomePatronPageComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private mediator: MediatorService,
    public api: ApiService
    ) { }

  rewards: any;
  minValue: number;

  ngOnInit() {
    this.rewards = this.route.snapshot.data.rewards;
    this.minValue = this.route.snapshot.params.min;
  }

  submit(reward) {
    this.mediator.requisitesCallback = (wif, login, postingWif, resolve) => {
        steem.broadcast.transfer(wif, login, reward.nick , reward.steem, login + ' is now a supporter for ' +reward.nick, (err, result) => {
            if(err) {
                alert('Cannot make transfer, please check username or password/active key');
                resolve(true);
            }
            if(result) {
                let data = {
                    op_data: reward,
                    user_from: login,
                };
                this.api.setAsPatron(data).then(
                    (data)=>{
                        let follower = login;
                        let following = reward.nick;
                        let json = JSON.stringify(
                            ['follow', {
                                follower: follower,
                                following: following,
                                what: ['blog']
                            }]
                        );
                        steem.broadcast.customJson(
                            postingWif,
                            [], // Required_auths
                            [follower], // Required Posting Auths
                            'follow', // Id
                            json, //
                            (err, result) => {
                                console.log(err, result);
                                resolve();
                                this.router.navigateByUrl(data.redirect);
                            }
                        );
                    },
                    (data) => {

                    });
                console.log(result);
            }
        });

    };

    this.router.navigateByUrl('requisites');
  }

}
