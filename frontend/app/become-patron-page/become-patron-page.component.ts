import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MediatorService} from '../mediator.service';
import {ApiService} from '../api.service';

let golos = require('golos-js');
golos.config.set('websocket', 'wss://ws.testnet3.golos.io');
golos.config.set('chain_id', '5876894a41e6361bde2e73278f07340f2eb8b41c2facd29099de9deef6cdb679');

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
        golos.broadcast.transfer(wif, login, reward.nick , reward.golos, login + ' is now a supporter for ' +reward.nick, (err, result) => {
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
                        golos.broadcast.customJson(
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
